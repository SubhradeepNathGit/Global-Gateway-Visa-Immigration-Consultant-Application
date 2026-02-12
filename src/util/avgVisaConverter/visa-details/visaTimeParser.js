export const parseToDays = (value) => {
    if (!value) return null;

    const text = value.toLowerCase().trim();
    const numberMatch = text.match(/\d+/);

    if (!numberMatch) return null;

    const num = Number(numberMatch[0]);

    if (text.includes("day")) return num;
    if (text.includes("week")) return num * 7;
    if (text.includes("month")) return num * 30;
    if (text.includes("year")) return num * 365;

    return null;
};