import type { OrderStatus, PaymentMethod, PaymentStatus } from '../../types';
import type { TranslationKey } from '../../i18n';

export function paymentMethodKey(method: PaymentMethod): TranslationKey {
  switch (method) {
    case 'CreditCard': return 'com.paymentMethod.creditCard';
    case 'PayPal': return 'com.paymentMethod.paypal';
    case 'ApplePay': return 'com.paymentMethod.applePay';
    case 'GooglePay': return 'com.paymentMethod.googlePay';
    case 'BankTransfer': return 'com.paymentMethod.bankTransfer';
    case 'GiftCard': return 'com.paymentMethod.giftCard';
  }
}

export function orderStatusKey(status: OrderStatus): TranslationKey {
  switch (status) {
    case 'Pending': return 'status.Pending';
    case 'Processing': return 'status.Processing';
    case 'Shipped': return 'status.Shipped';
    case 'Delivered': return 'status.Delivered';
    case 'Cancelled': return 'status.Cancelled';
  }
}

export function paymentStatusKey(status: PaymentStatus): TranslationKey {
  switch (status) {
    case 'Pending': return 'com.paymentStatus.pending';
    case 'Success': return 'com.paymentStatus.success';
    case 'Failed': return 'com.paymentStatus.failed';
  }
}

export function errorDetail(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
