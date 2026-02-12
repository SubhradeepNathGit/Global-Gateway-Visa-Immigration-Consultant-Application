export const processingTimeToDays = (value) => {
    if (!value) return 0;

    const parts = value.toLowerCase().split(" ");
    const amount = parseInt(parts[0], 10);
    const unit = parts[1]?.replace("s", "");

    if (isNaN(amount)) return 0;

    switch (unit) {
        case "day":
            return amount;
        case "week":
            return amount * 7;
        case "month":
            return amount * 30;
        default:
            return 0;
    }
}