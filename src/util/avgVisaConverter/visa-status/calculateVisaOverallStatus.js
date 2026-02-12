export const calculateVisaOverallStatus = (rows = []) => {
    if (!rows.length) {
        return {
            status: "blocked",
            blockedFor: ["All countries"],
        };
    }

    const inactive = rows.filter(r => r.status !== "active");

    if (inactive.length === 0) {
        return {
            status: "active",
            blockedFor: [],
        };
    }

    if (inactive.length === rows.length) {
        return {
            status: "blocked",
            blockedFor: ["All countries"],
        };
    }

    return {
        status: "blocked",
        blockedFor: inactive.map(r => r.visitor_country_name),
    };
}