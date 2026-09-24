/**
 * Payload for payment receipt emails (validated server-side against transaction_details).
 */
export function buildPaymentReceiptMeta({
  paymentDetails,
  type,
  subtotal,
  total,
  discountAmount,
  discount,
  visaData,
  visaSpecification,
  cartItems,
  applicationId,
}) {
  const transactionId = paymentDetails?.transaction_id;
  const amount = Number(paymentDetails?.total_amount ?? total ?? 0);
  const paymentMethod = paymentDetails?.payment_method ?? "N/A";

  let paymentDetail = null;
  if (paymentDetails?.upi_id) {
    paymentDetail = `UPI: ${paymentDetails.upi_id}`;
  } else if (paymentDetails?.masked_card) {
    const holder = paymentDetails?.card_holder_name
      ? ` · ${paymentDetails.card_holder_name}`
      : "";
    paymentDetail = `${paymentDetails?.card_type ?? "Card"} ${paymentDetails.masked_card}${holder}`;
  }

  const lineItems = [];

  if (type === "visa") {
    if (visaData?.visa_type) {
      lineItems.push({ label: "Visa type", value: String(visaData.visa_type) });
    }
    if (visaSpecification?.visa_processing_time) {
      lineItems.push({
        label: "Processing time",
        value: String(visaSpecification.visa_processing_time),
      });
    }
    if (applicationId) {
      lineItems.push({
        label: "Application reference",
        value: String(applicationId).slice(0, 8).toUpperCase(),
      });
    }
  } else {
    const items = Array.isArray(cartItems) ? cartItems : [];
    items.forEach((item, index) => {
      const name = item?.courses?.course_name ?? `Course ${index + 1}`;
      const price = item?.courses?.pricing ?? item?.price;
      lineItems.push({
        label: name,
        value: price != null
          ? `₹${Number(price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
          : "Included",
      });
    });
    if (subtotal != null) {
      lineItems.push({
        label: "Subtotal",
        value: `₹${Number(subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      });
    }
    if (discountAmount != null && Number(discountAmount) > 0) {
      lineItems.push({
        label: "Discount",
        value: `-₹${Number(discountAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}${discount ? ` (${discount})` : ""}`,
      });
    }
  }

  return {
    transactionId,
    amount,
    paymentMethod,
    paymentDetail,
    currency: "INR",
    paidAt: new Date().toISOString(),
    txnFor: type,
    status: "success",
    lineItems,
  };
}
