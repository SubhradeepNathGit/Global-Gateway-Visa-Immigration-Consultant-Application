export const daysToReadableTime = (days) => {
    if (!days || isNaN(days)) return "N/A";

    if (days >= 30) {
        return `${Math.round(days / 30)} month${Math.round(days / 30) > 1 ? "s" : ""}`;
    }

    if (days >= 7) {
        return `${Math.round(days / 7)} week${Math.round(days / 7) > 1 ? "s" : ""}`;
    }

    return `${Math.round(days)} day${Math.round(days) > 1 ? "s" : ""}`;
}