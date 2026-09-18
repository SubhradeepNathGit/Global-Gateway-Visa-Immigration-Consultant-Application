export const getContinentList = (continents) => {
    if (!continents) return [];
    if (Array.isArray(continents)) {
        return continents.flatMap(c => getContinentList(c)).filter(Boolean);
    }
    if (typeof continents === 'string') {
        const trimmed = continents.trim();
        if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
            try {
                const parsed = JSON.parse(trimmed);
                return getContinentList(parsed);
            } catch {
                // fall through
            }
        }
        return trimmed
            .replace(/[\[\]"']/g, '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
    }
    return [String(continents).replace(/[\[\]"']/g, '').trim()].filter(Boolean);
};

export const formatContinents = (continents) => {
    const list = getContinentList(continents);
    return list.length > 0 ? list.join(', ') : 'N/A';
};
