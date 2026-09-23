'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '@/lib/store/useUIStore';

export default function ToastNotification() {
  const { toast, clearToast } = useUIStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#38b000] text-white rounded-2xl shadow-xl border border-[#246342] max-w-sm">
        {icons[toast.type] || icons.success}
        <span className="text-xs font-medium flex-1">{toast.message}</span>
        <button
          type="button"
          onClick={clearToast}
          className="p-1 text-white/60 hover:text-white rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
