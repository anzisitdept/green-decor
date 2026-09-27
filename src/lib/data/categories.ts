import type { ProductCategoryDoc } from '@/types';

/**
 * Offline fallback for the `categories` Firestore collection. Used only when
 * that collection is empty or still loading, so the shop filter never renders
 * an empty dropdown. Edit the Firestore collection to reorder, rename, or hide
 * categories; change this list only to keep the first paint in sync.
 */
export const DEFAULT_CATEGORIES: ProductCategoryDoc[] = [
  { id: 'aquarium', label: 'Aquarium', order: 1, active: true },
  { id: 'candles', label: 'Candles', order: 2, active: true },
  { id: 'pots', label: 'Pots', order: 3, active: true },
  { id: 'wall-hangings', label: 'Wall hangings', order: 4, active: true },
  { id: 'chemicals', label: 'Chemicals', order: 5, active: true },
  { id: 'other', label: 'Other', order: 6, active: true },
];

export const CATEGORY_LABELS: Record<ProductCategoryDoc['id'], string> =
  DEFAULT_CATEGORIES.reduce(
    (acc, category) => {
      acc[category.id] = category.label;
      return acc;
    },
    {} as Record<ProductCategoryDoc['id'], string>
  );
