'use client';

import React from 'react';
import { getWhatsAppLink } from '@/lib/utils';
import { useSiteSettings } from '@/lib/firestore/store-data';

interface WhatsAppLinkProps {
  message: string;
  className?: string;
  children: React.ReactNode;
}

export default function WhatsAppLink({ message, className, children }: WhatsAppLinkProps) {
  const settings = useSiteSettings();

  return (
    <a
      href={getWhatsAppLink(message, settings.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
