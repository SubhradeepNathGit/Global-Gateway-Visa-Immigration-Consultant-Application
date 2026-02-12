export const formatDays = (days) => {
    if (!days) return "N/A";

    if (days >= 365) {
        const years = Math.round(days / 365);
        return `${years} year${years > 1 ? "s" : ""}`;
    }

    if (days >= 30) {
        const months = Math.round(days / 30);
        return `${months} month${months > 1 ? "s" : ""}`;
    }

    if (days >= 7) {
        const weeks = Math.round(days / 7);
        return `${weeks} week${weeks > 1 ? "s" : ""}`;
    }

    return `${days} day${days > 1 ? "s" : ""}`;
};