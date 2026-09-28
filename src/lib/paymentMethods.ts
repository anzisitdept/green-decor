import type { PaymentMethod } from '@/types';
import { CONTACT_PHONE } from '@/lib/contact';
import { normalizeContact } from '@/lib/phone';

/** The account title customers must type into their wallet app. */
const ACCOUNT_TITLE = 'Green Decor';

/**
 * JazzCash and EasyPaisa are the same wallet number, and it is the shop's
 * published contact number so there is only one number to publish and one to
 * verify a transfer against. Wallets want the local `03xx` form, not the
 * international one shown in the footer, so it is converted here rather than
 * duplicated as a literal.
 */
const WALLET_ACCOUNT = (() => {
  const normalized = normalizeContact(CONTACT_PHONE);
  if (!normalized) return CONTACT_PHONE;
  return `0${normalized.slice(2)}`;
})();

/**
 * Where the shop's money actually lands, and what the customer has to type in
 * after they have transferred. The payment step renders one card per entry, so
 * these strings are the instructions the customer follows — keep them copyable
 * and literal rather than decorative.
 */
export interface TransferMethod {
  id: Exclude<PaymentMethod, 'cod'>;
  label: string;
  badge: string;
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  instructions: string;
}

export const CASH_ON_DELIVERY_LABEL = 'Cash on Delivery';

export const TRANSFER_METHODS: TransferMethod[] = [
  {
    id: 'jazzcash',
    label: 'JazzCash Transfer',
    badge: 'Mobile Wallet',
    accountTitle: ACCOUNT_TITLE,
    accountNumber: WALLET_ACCOUNT,
    instructions: `Open your JazzCash app, choose Send Money, and transfer the exact order total to ${ACCOUNT_TITLE} at ${WALLET_ACCOUNT}. Then enter your JazzCash account title and number below and attach the confirmation screenshot.`,
  },
  {
    id: 'easypaisa',
    label: 'EasyPaisa Transfer',
    badge: 'Mobile Wallet',
    accountTitle: ACCOUNT_TITLE,
    accountNumber: WALLET_ACCOUNT,
    instructions: `Open your EasyPaisa app, choose Send Money, and transfer the exact order total to ${ACCOUNT_TITLE} at ${WALLET_ACCOUNT}. Then enter your EasyPaisa account title and number below and attach the confirmation screenshot.`,
  },
];

export function getTransferMethod(id: PaymentMethod): TransferMethod | undefined {
  return TRANSFER_METHODS.find((method) => method.id === id);
}

export function paymentMethodLabel(id: PaymentMethod): string {
  if (id === 'cod') return CASH_ON_DELIVERY_LABEL;
  return getTransferMethod(id)?.label ?? id;
}
