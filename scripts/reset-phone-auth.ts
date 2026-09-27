/**
 * Clears accounts that the phone+password login can no longer reach.
 *
 * Background: storefront accounts used to be created with
 * `createUserWithEmailAndPassword` under one of two keys:
 *
 *   - `${phone}@greendecor.com` — the synthetic phone key, still valid, so
 *     these people can sign in with their phone number as normal.
 *   - a real email address — these people are stranded, because the login form
 *     now resolves a phone number to a synthetic key and nothing else.
 *
 * This deletes ONLY the stranded ones. Phone-keyed accounts are left alone, and
 * so are:
 *
 *   - admin accounts (role === 'admin'). Admin sign-in is still email-based and
 *     the admin project has no service account, so deleting one would be
 *     unrecoverable from the panel.
 *   - welcome-coupon records. They are keyed by phone with no `uid` and no auth
 *     credential; they are the coupon funnel, not accounts.
 *
 *   npm run auth:reset              # preview
 *   npm run auth:reset -- --confirm # delete
 */
import { readFileSync } from 'node:fs';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { phoneFromAuthEmail } from '../src/lib/phone';

for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
}

/**
 * Confirmation is deliberately awkward to pass by accident. `process.argv` is
 * scanned in full because npm/tsx do not agree on where script arguments start,
 * and `AUTH_RESET_CONFIRM=1` exists for shells that mangle a trailing flag.
 */
const CONFIRM =
  process.env.AUTH_RESET_CONFIRM === '1' ||
  process.argv.some((a) => a === '--confirm' || a === 'confirm');

if (!CONFIRM) console.log('PREVIEW ONLY. Re-run with --confirm to delete.\n');

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });

const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  const authUsers = await auth.listUsers(1000);
  const profiles = await db.collection('users').get();
  const adminUids = new Set<string>();
  for (const doc of profiles.docs) {
    if (doc.data().role === 'admin' && doc.data().uid) adminUids.add(doc.data().uid as string);
  }

  const keepPhone: string[] = [];
  const deleteAuth: Array<{ uid: string; email: string | undefined }> = [];
  const protectedAdmin: string[] = [];

  for (const u of authUsers.users) {
    const email = u.email ?? undefined;
    const phone = phoneFromAuthEmail(email);
    const isAdmin = adminUids.has(u.uid);
    const isPhoneKeyed = phone !== null;

    if (isAdmin) protectedAdmin.push(`${u.email ?? u.uid} (phone-keyed: ${isPhoneKeyed})`);
    else if (isPhoneKeyed) keepPhone.push(`${phone} -> ${u.email}`);
    else deleteAuth.push({ uid: u.uid, email });
  }

  const doomedProfileIds = profiles.docs
    .filter((d) => {
      const data = d.data();
      return data.uid && deleteAuth.some((t) => t.uid === data.uid) && data.role !== 'admin';
    })
    .map((d) => d.id);

  const welcomeRecords = profiles.docs.filter(
    (d) => !d.data().uid
  ).length;

  // Deleting an account leaves its orders behind (they reference a userId
  // string), so surface how much revenue is attached to what is about to go.
  const ordersSnapshot = await db.collection('orders').get();
  const doomedUidSet = new Set(deleteAuth.map((t) => t.uid));
  const doomedRevenue = ordersSnapshot.docs.reduce((sum, d) => {
    const data = d.data();
    return doomedUidSet.has(data.userId) ? sum + (Number(data.total) || 0) : sum;
  }, 0);
  const doomedOrderCount = ordersSnapshot.docs.filter((d) =>
    doomedUidSet.has(d.data().userId)
  ).length;

  console.log(`auth accounts total:  ${authUsers.users.length}`);
  console.log(`protected (admin):    ${protectedAdmin.length}`);
  protectedAdmin.forEach((a) => console.log(`    ${a}`));
  console.log(`keep (phone-keyed):   ${keepPhone.length}`);
  keepPhone.forEach((a) => console.log(`    ${a}`));
  console.log(`DELETE (stranded):    ${deleteAuth.length}`);
  deleteAuth.forEach((a) => console.log(`    ${a.email ?? '(no email)'}  uid=${a.uid}`));
  console.log(`\nwould delete ${doomedProfileIds.length} users/* profile docs`);
  console.log(`untouched welcome/no-uid records: ${welcomeRecords}`);
  console.log(
    `orders: ${doomedOrderCount} orders (PKR ${doomedRevenue}) reference a doomed account`
  );
  console.log('  (orders are NOT deleted — they keep their userId, only the profile goes)');

  if (!CONFIRM) {
    console.log('\nNothing was written.');
    return;
  }

  if (deleteAuth.length === 0) {
    console.log('\nNothing to delete.');
    return;
  }

  for (const target of deleteAuth) {
    await auth.deleteUser(target.uid);
    console.log(`deleted auth user ${target.email ?? target.uid}`);
  }
  for (const id of doomedProfileIds) {
    await db.collection('users').doc(id).delete();
    console.log(`deleted profile ${id}`);
  }
  console.log('\nDone.');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
