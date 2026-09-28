'use client';

import { useRef, useState } from 'react';
import { FileCheck2, Loader2, Paperclip, X } from 'lucide-react';

export interface ReceiptValue {
  dataUrl: string;
  fileName: string;
}

interface Props {
  value: ReceiptValue | null;
  onChange: (value: ReceiptValue | null) => void;
  error?: string;
}

/**
 * The receipt rides along on the order document and is mirrored into the
 * browser's localStorage, so it is downscaled and re-encoded before it goes
 * anywhere. A modern phone screenshot is ~4 MB of PNG; after this it is a
 * couple of hundred KB of JPEG, which keeps the Firestore write (1 MB limit)
 * and localStorage comfortably clear.
 */
const MAX_DATA_URL_BYTES = 260_000;

/** Each pass trades detail for size; the first one that fits is used. */
const PASSES: { maxEdge: number; quality: number }[] = [
  { maxEdge: 1280, quality: 0.72 },
  { maxEdge: 1000, quality: 0.6 },
  { maxEdge: 800, quality: 0.5 },
];

async function compressToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Your browser could not process this image.');

  let smallest = '';
  for (const pass of PASSES) {
    const scale = Math.min(1, pass.maxEdge / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', pass.quality);
    if (dataUrl.length <= MAX_DATA_URL_BYTES) {
      bitmap.close();
      return dataUrl;
    }
    smallest = dataUrl;
  }

  bitmap.close();
  return smallest;
}

export default function ReceiptUpload({ value, onChange, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setLocalError('');

    if (!file.type.startsWith('image/')) {
      setLocalError('Attach a screenshot or photo of the transfer receipt.');
      return;
    }

    setBusy(true);
    try {
      const dataUrl = await compressToDataUrl(file);
      if (dataUrl.length > MAX_DATA_URL_BYTES) {
        setLocalError(
          'That screenshot is still too heavy to send. Please crop it to the transfer confirmation only.'
        );
        return;
      }
      onChange({ dataUrl, fileName: file.name });
    } catch {
      setLocalError('We could not read that image. Please try another file.');
    } finally {
      setBusy(false);
    }
  };

  const message = localError || error;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {value ? (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-[#0d3b2e] bg-[#f4f7f2] p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.dataUrl}
            alt="Payment receipt preview"
            className="h-16 w-16 shrink-0 rounded-xl border border-[#d6e2d3] object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-bold text-[#0d3b2e]">
              <FileCheck2 className="h-4 w-4" />
              Receipt attached
            </p>
            <p className="truncate text-[11px] text-[#52685a]">{value.fileName}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove receipt"
            className="rounded-full p-1.5 text-[#52685a] transition-colors hover:bg-white hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#d6e2d3] bg-white px-4 py-5 text-xs font-semibold text-[#0d3b2e] transition-colors hover:border-[#0d3b2e] hover:bg-[#f4f7f2] disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Paperclip className="h-4 w-4" />
          )}
          {busy ? 'Processing receipt...' : 'Attach transfer receipt (screenshot)'}
        </button>
      )}

      {message ? <p className="mt-1.5 text-[11px] font-semibold text-red-600">{message}</p> : null}
    </div>
  );
}
