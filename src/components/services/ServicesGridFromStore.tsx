'use client';

import { useStoreServices, useSiteContent } from '@/lib/firestore/store-data';
import ServicesCardGrid from '@/components/services/ServicesCardGrid';

export default function ServicesGridFromStore() {
  const allServices = useStoreServices();
  const { content } = useSiteContent();

  const grid = content?.servicesGrid;
  const ordered = grid?.serviceIds?.length
    ? grid.serviceIds
        .map((id) => allServices.find((s) => s.id === id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s))
    : [];
  const services = ordered.length > 0 ? ordered : allServices;

  return (
    <>
      {(grid?.heading || grid?.subcopy) && (
        <div className="pt-12 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-2">
          {grid?.heading && (
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#38b000] tracking-tight">
              {grid.heading}
            </h2>
          )}
          {grid?.subcopy && (
            <p className="text-xs sm:text-sm text-[#52685a] max-w-2xl mx-auto">
              {grid.subcopy}
            </p>
          )}
        </div>
      )}
      <ServicesCardGrid services={services} />
    </>
  );
}
