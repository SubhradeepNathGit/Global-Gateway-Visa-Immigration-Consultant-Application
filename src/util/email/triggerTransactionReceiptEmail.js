import { EmailEvents } from "./emailEvents";
import { buildPaymentReceiptMeta } from "./buildPaymentReceiptMeta";
import { sendTransactionalEmailAsync } from "./sendTransactionalEmail";

/**
 * Send payment receipt email for a completed transaction (visa or course).
 * Call only after DB links exist: application_payment (visa) or orders (course).
 */
export function triggerTransactionReceiptEmail({
  type,
  paymentDetails,
  personalInfoData,
  subtotal,
  total,
  discountAmount,
  discount,
  visaData,
  visaSpecification,
  cartItems,
}) {
  const meta = buildPaymentReceiptMeta({
    paymentDetails,
    type,
    subtotal,
    total,
    discountAmount,
    discount,
    visaData,
    visaSpecification,
    cartItems,
    applicationId: personalInfoData?.application_id,
  });

  if (!meta.transactionId) return;

  if (type === "visa") {
    sendTransactionalEmailAsync({
      eventType: EmailEvents.VISA_PAYMENT_RECEIPT,
      applicationId: personalInfoData?.application_id,
      meta,
    });
    return;
  }

  if (type === "course") {
    sendTransactionalEmailAsync({
      eventType: EmailEvents.COURSE_PAYMENT_RECEIPT,
      userId: personalInfoData?.id,
      meta,
    });
  }
}

/** Notify user when a transaction is recorded as failed */
export function triggerTransactionFailedEmail({
  type,
  paymentDetails,
  personalInfoData,
  subtotal,
  total,
  discountAmount,
  discount,
  visaData,
  visaSpecification,
  cartItems,
}) {
  const meta = buildPaymentReceiptMeta({
    paymentDetails,
    type,
    subtotal,
    total,
    discountAmount,
    discount,
    visaData,
    visaSpecification,
    cartItems,
    applicationId: personalInfoData?.application_id,
  });

  meta.status = "failed";

  if (!meta.transactionId) return;

  sendTransactionalEmailAsync({
    eventType: EmailEvents.PAYMENT_FAILED,
    applicationId: type === "visa" ? personalInfoData?.application_id : undefined,
    userId: personalInfoData?.id,
    meta,
  });
}
