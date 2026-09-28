'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Banknote,
  Building,
  Check,
  Copy,
  FileText,
  Landmark,
  Lock,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useOrdersStore } from '@/lib/store/useOrdersStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useUIStore } from '@/lib/store/useUIStore';
import { useCheckoutStore } from '@/lib/store/useCheckoutStore';
import { createOrder as persistOrder } from '@/lib/firestore/writes';
import { redeemCoupon } from '@/lib/redeemCoupon';
import { getWhatsAppLink, formatPKR } from '@/lib/utils';
import { CASH_ON_DELIVERY_LABEL, TRANSFER_METHODS, getTransferMethod } from '@/lib/paymentMethods';
import type { OrderPaymentDetails, PaymentMethod } from '@/types';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';
import ReceiptUpload, { type ReceiptValue } from '@/components/checkout/ReceiptUpload';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-[#d6e2d3] text-xs focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none';
const labelClass = 'block text-xs font-bold text-[#172b21] mb-1';

const METHOD_ICONS: Record<PaymentMethod, React.ReactNode> = {
  cod: <Banknote className="w-4 h-4 text-[#0d3b2e]" />,
  jazzcash: <Smartphone className="w-4 h-4 text-[#0d3b2e]" />,
  easypaisa: <Wallet className="w-4 h-4 text-[#0d3b2e]" />,
  bank_transfer: <Landmark className="w-4 h-4 text-[#0d3b2e]" />,
};

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, promoCode, getSubtotal, getDiscount, getShippingFee, getTotal, clearCart } =
    useCartStore();
  const { createOrder } = useOrdersStore();
  const { showToast } = useUIStore();
  const { address, clear: clearDraft } = useCheckoutStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [senderName, setSenderName] = useState('');
  const [senderAccount, setSenderAccount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [receipt, setReceipt] = useState<ReceiptValue | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const total = getTotal();

  const transferMethod = getTransferMethod(paymentMethod);
  const isTransfer = paymentMethod !== 'cod';

  // The cart is emptied the moment an order exists, and the payment step is
  // meaningless without a bag — send the visitor back rather than showing a
  // dead form.
  useEffect(() => {
    if (items.length === 0) router.replace('/checkout');
  }, [items.length, router]);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      showToast('Copy failed — please select the number manually.', 'warning');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      router.push('/checkout');
      return;
    }

    const nextErrors: Record<string, string> = {};
    if (isTransfer) {
      if (!senderName.trim()) nextErrors.senderName = 'Enter the account title you paid from.';
      if (!senderAccount.trim()) nextErrors.senderAccount = 'Enter the account or mobile number you paid from.';
      if (!receipt) nextErrors.receipt = 'Attach the transfer receipt so we can verify the payment.';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showToast('Please complete the payment details.', 'warning');
      return;
    }
    setErrors({});

    setIsSubmitting(true);

    // Consume the coupon before the order exists. Firestore rules block the
    // browser from incrementing usedCount, so the server has to do it, and a
    // code that turns out to be exhausted has to stop the order rather than
    // quietly apply a discount nobody paid for.
    if (promoCode) {
      try {
        await redeemCoupon(promoCode);
      } catch (err) {
        setIsSubmitting(false);
        showToast(
          err instanceof Error ? err.message : 'We could not verify your promo code.',
          'warning'
        );
        return;
      }
    }

    const paymentDetails: OrderPaymentDetails | undefined = isTransfer
      ? {
          senderName: senderName.trim(),
          senderAccount: senderAccount.trim(),
          transactionId: transactionId.trim() || undefined,
          paidAmount: paidAmount ? Number(paidAmount.replace(/[^\d.]/g, '')) || undefined : undefined,
          receiptDataUrl: receipt?.dataUrl,
          receiptFileName: receipt?.fileName,
          submittedAt: new Date().toISOString(),
        }
      : undefined;

    const order = createOrder(
      items,
      address,
      paymentMethod,
      subtotal,
      shipping,
      discount,
      total,
      user?.uid,
      promoCode ?? undefined,
      paymentDetails
    );

    // Persist to Firestore so the admin panel sees the order immediately.
    persistOrder(order).catch(() => {
      // Local order is kept as a cache even if the network write fails.
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d3b2e', '#2d6a4f', '#d47343', '#52b788'],
      });
    } catch {
      // ignore
    }

    clearCart();
    clearDraft();
    showToast(`Order #${order.id} placed successfully!`);
    router.push(`/orders/${order.id}`);
  };

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-[#0d3b2e]">Nothing to pay for yet</h1>
        <p className="text-xs text-[#52685a] mt-2 mb-6">Add something to your bag first.</p>
        <Link href="/shop" className="px-6 py-3 rounded-full bg-[#0d3b2e] text-white text-xs font-bold">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#52685a] mb-2">
          <Link href="/cart" className="hover:text-[#0d3b2e]">Cart</Link>
          <span>/</span>
          <Link href="/checkout" className="hover:text-[#0d3b2e]">Delivery Details</Link>
          <span>/</span>
          <span className="text-[#0d3b2e]">Payment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d3b2e]">Choose how to pay</h1>
        <p className="text-xs sm:text-sm text-[#52685a] mt-1">
          Step 2 of 2 — pay cash on delivery, or send us the transfer receipt.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          {/* Delivery recap */}
          {address ? (
            <div className="bg-white rounded-3xl p-5 border border-[#e5ece3] shadow-sm flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#52685a]">
              <span className="font-bold text-[#0d3b2e] text-sm">Delivering to</span>
              <span className="font-semibold text-[#172b21]">{address.fullName}</span>
              <span>{address.phone}</span>
              <span>
                {address.streetAddress}, {address.city}, {address.province}
              </span>
              <Link href="/checkout" className="font-semibold text-[#0d3b2e] underline underline-offset-4">
                Edit
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
              <Link href="/checkout" className="underline underline-offset-4">
                Add your delivery details
              </Link>{' '}
              before choosing a payment method.
            </div>
          )}

          {/* Method selection */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e5ece3] shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#0d3b2e] flex items-center gap-2 pb-3 border-b border-[#f0f4ee]">
              <Banknote className="w-4 h-4" />
              <span>Payment Method</span>
            </h3>

            <label
              onClick={() => setPaymentMethod('cod')}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                paymentMethod === 'cod'
                  ? 'border-[#0d3b2e] bg-[#f4f7f2]'
                  : 'border-[#edf3ec] hover:border-[#d6e2d3] bg-white'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="mt-0.5 accent-[#0d3b2e]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#172b21]">{CASH_ON_DELIVERY_LABEL} (COD)</span>
                  <span className="text-[10px] font-bold text-[#0d3b2e] bg-[#eaf0e7] px-2 py-0.5 rounded-full">
                    Most Popular in PK
                  </span>
                </div>
                <p className="text-xs text-[#52685a] mt-0.5">
                  Pay in cash to the delivery rider on arrival. Nothing to submit.
                </p>
              </div>
            </label>

            {TRANSFER_METHODS.map((method) => (
              <label
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === method.id
                    ? 'border-[#0d3b2e] bg-[#f4f7f2]'
                    : 'border-[#edf3ec] hover:border-[#d6e2d3] bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id)}
                  className="mt-0.5 accent-[#0d3b2e]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs font-bold text-[#172b21]">
                      {METHOD_ICONS[method.id]}
                      {method.label}
                    </span>
                    <span className="text-[10px] font-bold text-[#d47343] bg-[#fdf3ec] px-2 py-0.5 rounded-full">
                      {method.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#52685a] mt-0.5">
                    Send the total, then attach your receipt below.
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Transfer instructions + proof */}
          {isTransfer && transferMethod ? (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e5ece3] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#0d3b2e] flex items-center gap-2 pb-3 border-b border-[#f0f4ee]">
                {METHOD_ICONS[paymentMethod]}
                <span>{transferMethod.label} — where to send the money</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f4f7f2] border border-[#e5ece3] p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#52685a] mb-1">
                    Account Title
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#172b21]">{transferMethod.accountTitle}</p>
                    <button
                      type="button"
                      onClick={() => copy('title', transferMethod.accountTitle)}
                      aria-label="Copy account title"
                      className="shrink-0 rounded-lg p-1.5 text-[#52685a] transition-colors hover:bg-white hover:text-[#0d3b2e]"
                    >
                      {copied === 'title' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {transferMethod.bankName ? (
                    <p className="text-[11px] text-[#52685a] mt-1 flex items-center gap-1.5">
                      <Building className="w-3 h-3" />
                      {transferMethod.bankName}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-2xl bg-[#f4f7f2] border border-[#e5ece3] p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#52685a] mb-1">
                    Account Number
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-extrabold tracking-wider text-[#0d3b2e]">
                      {transferMethod.accountNumber}
                    </p>
                    <button
                      type="button"
                      onClick={() => copy('number', transferMethod.accountNumber)}
                      aria-label="Copy account number"
                      className="shrink-0 rounded-lg p-1.5 text-[#52685a] transition-colors hover:bg-white hover:text-[#0d3b2e]"
                    >
                      {copied === 'number' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#52685a] mt-1">
                    Amount to send: <strong className="text-[#0d3b2e]">{formatPKR(total)}</strong>
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#52685a] leading-relaxed rounded-2xl bg-[#fdf3ec] px-3.5 py-3">
                {transferMethod.instructions}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Your Account Title *</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Hamza Khan"
                    className={inputClass}
                  />
                  {errors.senderName ? (
                    <p className="mt-1 text-[11px] font-semibold text-red-600">{errors.senderName}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClass}>Your Account / Mobile No. *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={senderAccount}
                    onChange={(e) => setSenderAccount(e.target.value)}
                    placeholder="e.g. 0321 1234567"
                    className={inputClass}
                  />
                  {errors.senderAccount ? (
                    <p className="mt-1 text-[11px] font-semibold text-red-600">{errors.senderAccount}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClass}>Transaction / TID</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Amount You Sent (PKR)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value.replace(/[^\d.]/g, ''))}
                    placeholder={String(total)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Transfer Receipt *</label>
                  <ReceiptUpload value={receipt} onChange={setReceipt} error={errors.receipt} />
                </div>
              </div>

              <a
                href={getWhatsAppLink(
                  `Hello Green Decor! I am sending a ${transferMethod.label} for my order.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#52685a] hover:text-[#0d3b2e]"
              >
                <FileText className="w-3.5 h-3.5" />
                Paid but no receipt? Send us the transaction ID on WhatsApp instead.
              </a>
            </div>
          ) : null}
        </div>

        <OrderSummaryCard
          items={items}
          subtotal={subtotal}
          discount={discount}
          shipping={shipping}
          total={total}
        >
          <div className="rounded-2xl bg-[#f4f7f2] border border-[#e5ece3] px-3.5 py-3 text-xs text-[#52685a]">
            {isTransfer ? (
              <span>
                Paying by <strong className="text-[#0d3b2e]">{transferMethod?.label}</strong>. Your order is
                confirmed as soon as we verify the receipt.
              </span>
            ) : (
              <span>
                Paying <strong className="text-[#0d3b2e]">{formatPKR(total)}</strong> in cash on delivery.
                Nothing to upload.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !address}
            className="w-full py-4 rounded-2xl bg-[#0d3b2e] text-white text-sm font-bold hover:bg-[#145c43] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Placing Your Order...'
                : isTransfer
                  ? 'Submit Payment & Place Order'
                  : `Place Order • ${formatPKR(total)}`}
            </span>
          </button>

          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#52685a] hover:text-[#0d3b2e]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to delivery details
          </Link>
        </OrderSummaryCard>
      </form>
    </div>
  );
}
