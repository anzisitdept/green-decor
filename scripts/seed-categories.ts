/**
 * Pushes the shop categories to Firestore and moves every product onto one of
 * them. Safe to re-run: categories are merged, and a product is only written
 * when its category or label actually differs.
 *
 *   npm run seed:categories            # write
 *   npm run seed:categories -- --dry-run   # preview only
 *
 * The canonical list lives in src/lib/data/categories.ts. Edit that file, then
 * re-run this script to publish the change.
 */
import { readFileSync } from 'node:fs';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { DEFAULT_CATEGORIES } from '../src/lib/data/categories';

for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });

const db = getFirestore(app);
const DRY_RUN = process.argv.slice(2).some((arg) => arg.startsWith('--dry-run') || arg === 'dry-run');
if (DRY_RUN) console.log('DRY RUN: nothing will be written\n');

/**
 * Retired slug -> replacement. Keyed by product slug so the intent for each
 * product is reviewable here rather than hidden in a generic rule.
 */
const SLUG_REMAP: Record<string, string> = {
  'zz-plant-ribbed-pot': 'pots',
  'artisan-terracotta-fluted-planter': 'pots',
  'botanical-harmony-trio-mini-succulents': 'pots',
  'geometric-brass-hanging-planter-trio': 'wall-hangings',
  'green-shield-organic-neem-oil-spray': 'chemicals',
  'zenith-rimless-ultra-clear-aquarium': 'aquarium',
  'living-moss-dragon-stone-aquascape-pack': 'aquarium',
};

const FALLBACK_CATEGORY = 'other';

async function main() {
  const labels = new Map<string, string>(
    DEFAULT_CATEGORIES.map((c) => [c.id, c.label])
  );

  if (!DRY_RUN) {
    const categoryBatch = db.batch();
    for (const category of DEFAULT_CATEGORIES) {
      categoryBatch.set(db.collection('categories').doc(category.id), category);
    }
    await categoryBatch.commit();
  }
  console.log(`categories: ${DRY_RUN ? 'would upsert' : 'upserted'} ${DEFAULT_CATEGORIES.length} documents`);

  const products = await db.collection('products').get();
  const batch = db.batch();
  const updates: Array<{ slug: string; from: string; to: string }> = [];

  for (const doc of products.docs) {
    const data = doc.data();
    const slug = (data.slug as string) || doc.id;
    const current = data.category as string;

    // Explicit mapping first, then keep the slug when it is already valid,
    // and only fall back to "other" when the product would otherwise be
    // unreachable from every filter.
    const target = SLUG_REMAP[slug] ?? (labels.has(current) ? current : FALLBACK_CATEGORY);
    const label = labels.get(target)!;

    if (target === current && data.categoryLabel === label) continue;

    if (!DRY_RUN) batch.set(doc.ref, { category: target, categoryLabel: label }, { merge: true });
    updates.push({ slug, from: current || '(none)', to: target });
  }

  if (updates.length > 0 && !DRY_RUN) {
    await batch.commit();
  }

  console.log(`products: ${DRY_RUN ? 'would remap' : 'remapped'} ${updates.length} of ${products.size}`);
  for (const update of updates) {
    console.log(`  ${update.slug}: ${update.from} -> ${update.to}`);
  }

  const counts = new Map<string, number>();
  products.docs.forEach((doc) => {
    const data = doc.data();
    const target = SLUG_REMAP[data.slug as string] ?? (labels.has(data.category as string) ? data.category : FALLBACK_CATEGORY);
    counts.set(target, (counts.get(target) ?? 0) + 1);
  });
  console.log('resulting counts:', JSON.stringify([...counts.entries()].sort()));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
