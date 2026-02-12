import { parseToDays } from "./visaTimeParser";

export const calculateVisaAverages = (rows) => {
    let processingSum = 0;
    let validitySum = 0;
    let feesSum = 0;

    let processingCount = 0;
    let validityCount = 0;
    let feesCount = 0;

    rows.forEach((row) => {
        const processingDays = parseToDays(row.visa_processing_time);
        const validityDays = parseToDays(row.visa_validity);
        const fees = Number(row.visa_fees);

        if (processingDays !== null) {
            processingSum += processingDays;
            processingCount++;
        }

        if (validityDays !== null) {
            validitySum += validityDays;
            validityCount++;
        }

        if (!isNaN(fees)) {
            feesSum += fees;
            feesCount++;
        }
    });

    return {
        avgProcessingDays: processingCount
            ? Math.round(processingSum / processingCount)
            : null,

        avgValidityDays: validityCount
            ? Math.round(validitySum / validityCount)
            : null,

        avgFees: feesCount
            ? Math.round(feesSum / feesCount)
            : null,
    };
};
