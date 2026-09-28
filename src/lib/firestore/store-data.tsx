'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useFirestoreCollection, useFirestoreDoc } from '@/lib/firestore/hooks';
import { COLLECTIONS, SETTINGS_GENERAL_ID, SITE_CONTENT_ID } from '@/lib/firestore/collections';
import { productsData } from '@/lib/data/products';
import { DEFAULT_CATEGORIES } from '@/lib/data/categories';
import { servicesData } from '@/lib/data/services';
import { testimonialsData } from '@/lib/data/testimonials';
import type {
  Coupon,
  GalleryCategory,
  GalleryProject,
  Product,
  ProductCategoryDoc,
  ServiceItem,
  SiteContent,
  SiteContentDoc,
  SiteSettings,
  Testimonial,
} from '@/types';

export const DEFAULT_SETTINGS: SiteSettings = {
  workingHours: '',
  shippingFreeThreshold: 4000,
  shippingFlatFee: 350,
  currencyLabel: 'PKR',
  deliveryCities: [],
  supportedProvinces: [],
};

interface StoreDataValue {
  products: Product[];
  categories: ProductCategoryDoc[];
  services: ServiceItem[];
  galleryProjects: GalleryProject[];
  galleryCategories: GalleryCategory[];
  testimonials: Testimonial[];
  coupons: Coupon[];
  settings: SiteSettings;
  content: SiteContent | null;
  loading: {
    products: boolean;
    categories: boolean;
    services: boolean;
    galleryProjects: boolean;
    galleryCategories: boolean;
    testimonials: boolean;
    coupons: boolean;
    settings: boolean;
    content: boolean;
  };
}

const StoreDataContext = createContext<StoreDataValue | null>(null);

export function StoreDataProvider({ children }: { children: ReactNode }) {
  const productsQ = useFirestoreCollection<Product>(COLLECTIONS.products);
  const categoriesQ = useFirestoreCollection<ProductCategoryDoc>(
    COLLECTIONS.categories,
    { orderByField: 'order', orderDirection: 'asc' }
  );
  const servicesQ = useFirestoreCollection<ServiceItem>(COLLECTIONS.services);
  const galleryProjectsQ = useFirestoreCollection<GalleryProject>(COLLECTIONS.galleryProjects, {
    orderByField: 'order',
    orderDirection: 'asc',
  });
  const galleryCategoriesQ = useFirestoreCollection<GalleryCategory>(
    COLLECTIONS.galleryCategories,
    { orderByField: 'order', orderDirection: 'asc' }
  );
  const testimonialsQ = useFirestoreCollection<Testimonial>(COLLECTIONS.testimonials);
  const couponsQ = useFirestoreCollection<Coupon>(COLLECTIONS.coupons);
  const settingsQ = useFirestoreDoc<SiteSettings & { id: string }>(
    COLLECTIONS.settings,
    SETTINGS_GENERAL_ID
  );
  const contentQ = useFirestoreDoc<SiteContentDoc>(COLLECTIONS.siteContent, SITE_CONTENT_ID);

  const value = useMemo<StoreDataValue>(() => {
    const categories =
      categoriesQ.data.length > 0 ? categoriesQ.data : DEFAULT_CATEGORIES;

    // Labels live in the category documents so a rename in Firestore updates
    // every product card and breadcrumb without touching product records.
    const categoryLabels = new Map(
      categories.map((category) => [category.id, category.label])
    );
    const productsSource = productsQ.data.length > 0 ? productsQ.data : productsData;
    const products = productsSource.map((product) => {
      const label = categoryLabels.get(product.category);
      return label && label !== product.categoryLabel
        ? { ...product, categoryLabel: label }
        : product;
    });

    const services = servicesQ.data.length > 0 ? servicesQ.data : servicesData;
    const testimonials =
      testimonialsQ.data.length > 0
        ? testimonialsQ.data
        : testimonialsData;

    // The gallery has no offline fallback on purpose: it shows only what staff
    // have published from the admin panel, so nothing stale can appear.
    const galleryProjects = galleryProjectsQ.data;
    const galleryCategories = galleryCategoriesQ.data;

    const settings = settingsQ.data
      ? { ...DEFAULT_SETTINGS, ...settingsQ.data }
      : DEFAULT_SETTINGS;

    const publishedContent =
      contentQ.data && contentQ.data.published ? contentQ.data.content : null;

    return {
      products,
      categories,
      services,
      galleryProjects,
      galleryCategories,
      testimonials,
      coupons: couponsQ.data,
      settings,
      content: publishedContent,
      loading: {
        products: productsQ.loading,
        categories: categoriesQ.loading,
        services: servicesQ.loading,
        galleryProjects: galleryProjectsQ.loading,
        galleryCategories: galleryCategoriesQ.loading,
        testimonials: testimonialsQ.loading,
        coupons: couponsQ.loading,
        settings: settingsQ.loading,
        content: contentQ.loading,
      },
    };
  }, [
    productsQ.data,
    productsQ.loading,
    categoriesQ.data,
    categoriesQ.loading,
    servicesQ.data,
    servicesQ.loading,
    galleryProjectsQ.data,
    galleryProjectsQ.loading,
    galleryCategoriesQ.data,
    galleryCategoriesQ.loading,
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

/**
 * Live shop categories, ordered by their `order` field. Inactive categories are
 * dropped here so every consumer (shop filter, sidebars) agrees on what shows.
 */
export function useStoreCategories(): ProductCategoryDoc[] {
  return useStoreData().categories.filter((category) => category.active !== false);
}

export function useStoreServices(): ServiceItem[] {
  return useStoreData().services;
}

/**
 * Live gallery projects, ordered by their `order` field. Projects an admin has
 * hidden (`active: false`) are dropped so the public gallery only shows what is
 * published.
 */
export function useStoreGalleryProjects(): GalleryProject[] {
  return useStoreData().galleryProjects.filter((project) => project.active !== false);
}

/** Live gallery filter categories, ordered by `order`. Inactive ones are dropped. */
export function useStoreGalleryCategories(): GalleryCategory[] {
  return useStoreData().galleryCategories.filter((category) => category.active !== false);
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
