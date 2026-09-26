'use client';

import React from 'react';
import { getWhatsAppLink } from '@/lib/utils';

interface WhatsAppLinkProps {
  message: string;
  className?: string;
  children: React.ReactNode;
}

export default function WhatsAppLink({ message, className, children }: WhatsAppLinkProps) {
  return (
    <a
      href={getWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
