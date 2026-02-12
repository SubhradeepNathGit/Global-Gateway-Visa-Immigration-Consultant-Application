export const daysToReadableValidity = (days) => {
    if (!days || isNaN(days)) return "N/A";

    // Prefer years first
    if (days >= 365) {
        const years = Math.round(days / 365);
        return `${years} year${years > 1 ? "s" : ""}`;
    }

    // Then months
    if (days >= 30) {
        const months = Math.round(days / 30);
        return `${months} month${months > 1 ? "s" : ""}`;
    }

    // Else days
    const d = Math.round(days);
    return `${d} day${d > 1 ? "s" : ""}`;
}