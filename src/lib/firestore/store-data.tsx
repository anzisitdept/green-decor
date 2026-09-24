'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useFirestoreCollection, useFirestoreDoc } from '@/lib/firestore/hooks';
import { COLLECTIONS, SETTINGS_GENERAL_ID, SITE_CONTENT_ID } from '@/lib/firestore/collections';
import { productsData } from '@/lib/data/products';
import { servicesData } from '@/lib/data/services';
import { testimonialsData } from '@/lib/data/testimonials';
import type {
  Coupon,
  Product,
  ServiceItem,
  SiteContent,
  SiteContentDoc,
  SiteSettings,
  Testimonial,
} from '@/types';

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: '+92 333 8951222',
  contactPhone: '+92 333 8951222',
  contactEmail: 'info@greendecor.com',
  address: '',
  workingHours: '',
  shippingFreeThreshold: 4000,
  shippingFlatFee: 350,
  currencyLabel: 'PKR',
  deliveryCities: [],
  supportedProvinces: [],
};

interface StoreDataValue {
  products: Product[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  coupons: Coupon[];
  settings: SiteSettings;
  content: SiteContent | null;
  loading: {
    products: boolean;
    services: boolean;
    testimonials: boolean;
    coupons: boolean;
    settings: boolean;
    content: boolean;
  };
}

const StoreDataContext = createContext<StoreDataValue | null>(null);

export function StoreDataProvider({ children }: { children: ReactNode }) {
  const productsQ = useFirestoreCollection<Product>(COLLECTIONS.products);
  const servicesQ = useFirestoreCollection<ServiceItem>(COLLECTIONS.services);
  const testimonialsQ = useFirestoreCollection<Testimonial>(COLLECTIONS.testimonials);
  const couponsQ = useFirestoreCollection<Coupon>(COLLECTIONS.coupons);
  const settingsQ = useFirestoreDoc<SiteSettings & { id: string }>(
    COLLECTIONS.settings,
    SETTINGS_GENERAL_ID
  );
  const contentQ = useFirestoreDoc<SiteContentDoc>(COLLECTIONS.siteContent, SITE_CONTENT_ID);

  const value = useMemo<StoreDataValue>(() => {
    const products = productsQ.data.length > 0 ? productsQ.data : productsData;
    const services = servicesQ.data.length > 0 ? servicesQ.data : servicesData;
    const testimonials =
      testimonialsQ.data.length > 0
        ? testimonialsQ.data
        : testimonialsData;

    const settings = settingsQ.data
      ? { ...DEFAULT_SETTINGS, ...settingsQ.data }
      : DEFAULT_SETTINGS;

    const publishedContent =
      contentQ.data && contentQ.data.published ? contentQ.data.content : null;

    return {
      products,
      services,
      testimonials,
      coupons: couponsQ.data,
      settings,
      content: publishedContent,
      loading: {
        products: productsQ.loading,
        services: servicesQ.loading,
        testimonials: testimonialsQ.loading,
        coupons: couponsQ.loading,
        settings: settingsQ.loading,
        content: contentQ.loading,
      },
    };
  }, [
    productsQ.data,
    productsQ.loading,
    servicesQ.data,
    servicesQ.loading,
    testimonialsQ.data,
    testimonialsQ.loading,
    couponsQ.data,
    couponsQ.loading,
    settingsQ.data,
    settingsQ.loading,
    contentQ.data,
    contentQ.loading,
  ]);

  return <StoreDataContext.Provider value={value}>{children}</StoreDataContext.Provider>;
}

export function useStoreData(): StoreDataValue {
  const ctx = useContext(StoreDataContext);
  if (!ctx) {
    throw new Error('useStoreData must be used within a StoreDataProvider');
  }
  return ctx;
}

export function useStoreProducts(): Product[] {
  return useStoreData().products;
}

export function useStoreServices(): ServiceItem[] {
  return useStoreData().services;
}

export function useStoreTestimonials(): Testimonial[] {
  return useStoreData().testimonials;
}

export function useStoreCoupons(): Coupon[] {
  return useStoreData().coupons;
}

export function useSiteSettings(): SiteSettings {
  return useStoreData().settings;
}

export function useSiteContent(): {
  content: SiteContent | null;
  loading: boolean;
} {
  const { content, loading } = useStoreData();
  return { content, loading: loading.content };
}
