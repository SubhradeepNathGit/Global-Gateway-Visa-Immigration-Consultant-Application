export function calculateExpirationDate(approvalDate, validity) {
    if (!approvalDate || !validity) return null;

    const date = new Date(approvalDate);

    const match = validity.match(/(\d+)\s*(day|days|month|months|year|years)/i);
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
        case "day":
        case "days":
            date.setDate(date.getDate() + value);
            break;

        case "month":
        case "months":
            date.setMonth(date.getMonth() + value);
            break;

        case "year":
        case "years":
            date.setFullYear(date.getFullYear() + value);
            break;

        default:
            return null;
    }

    return date.toISOString();
}