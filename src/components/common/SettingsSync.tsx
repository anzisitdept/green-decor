'use client';

import { useEffect } from 'react';
import { useSiteSettings } from '@/lib/firestore/store-data';
import { useCartStore } from '@/lib/store/useCartStore';

export default function SettingsSync() {
  const settings = useSiteSettings();
  const setShippingConfig = useCartStore((s) => s.setShippingConfig);

  useEffect(() => {
    setShippingConfig(settings.shippingFreeThreshold, settings.shippingFlatFee);
  }, [settings.shippingFreeThreshold, settings.shippingFlatFee, setShippingConfig]);

  return null;
}
