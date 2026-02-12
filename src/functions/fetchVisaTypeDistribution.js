import supabase from "../util/Supabase/supabase";

const VISA_COLORS = {
    "Student Visa": "#3b82f6",
    "Tourist Visa": "#10b981",
    "Business Visa": "#f59e0b",
    "Worker Visa": "#8b5cf6",
    "Family Visa": "#ec4899",
    "Resident Visa": "#06b6d4",
};

export async function fetchVisaTypeDistribution() {
    // 1. Fetch visa details
    const { data: visaDetails, error: visaError } = await supabase.from("application_visa_details").select("application_id, visa_type");

    if (visaError) throw visaError;

    // 2. Fetch successful payments
    const { data: payments, error: paymentError } = await supabase.from("application_payment").select("application_id, amount").eq("status", "success");

    if (paymentError) throw paymentError;

    // 3. Map payments by application_id
    const paymentMap = {};
    payments.forEach(payment => {
        paymentMap[payment.application_id] =
            (paymentMap[payment.application_id] || 0) + Number(payment.amount || 0);
    });

    // 4. Aggregate by visa type
    const stats = {};

    visaDetails.forEach(visa => {
        const amount = paymentMap[visa.application_id] || 0;

        if (!stats[visa.visa_type]) {
            stats[visa.visa_type] = {
                name: visa.visa_type,
                value: 0,
                revenue: 0,
                color: VISA_COLORS[visa.visa_type] || "#9ca3af",
            };
        }

        stats[visa.visa_type].value += 1;
        stats[visa.visa_type].revenue += amount;
    });

    return Object.values(stats);
}