export const validityToDays = (value) => {
    if (!value) return 0;

    const parts = value.toLowerCase().trim().split(" ");
    const amount = parseInt(parts[0], 10);
    const unit = parts[1]?.replace("s", "");

    if (isNaN(amount)) return 0;

    switch (unit) {
        case "day":
            return amount;
        case "month":
            return amount * 30;
        case "year":
            return amount * 365;
        default:
            return 0;
    }
}