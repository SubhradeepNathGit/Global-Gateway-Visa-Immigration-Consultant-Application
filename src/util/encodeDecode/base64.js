export const encodeBase64Url = (str) =>
    btoa(String.fromCharCode(...new TextEncoder().encode(str)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");


export const decodeBase64Url = (str) => {
    if (!str) return;
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return new TextDecoder().decode(
        Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    );
};