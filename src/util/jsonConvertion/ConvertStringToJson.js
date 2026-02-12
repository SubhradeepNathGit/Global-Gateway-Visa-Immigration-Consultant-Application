export const parseJSONSafe = (value) => {
    try {
        return typeof value === "string" ? JSON.parse(value) : value;
    } catch {
        return null;
    }
}