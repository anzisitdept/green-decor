'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/lib/store/useWishlistStore';

export default function StoreHydrator() {
  useEffect(() => {
    useWishlistStore.persist.rehydrate();
  }, []);

  return null;
}