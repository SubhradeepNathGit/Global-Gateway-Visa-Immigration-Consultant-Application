import { staticCountries } from "../data/countriesData";

let remoteCountriesCache = null;

const normalize = (str) => {
    if (!str) return "";
    return String(str).toLowerCase().trim().replace(/[^a-z0-9]/g, "");
};

const formatCountryResult = (country) => {
    const currencyKey = Object.keys(country.currencies || {})[0];
    const currency = country.currencies?.[currencyKey];

    return {
        name: country.name?.common || country.name,
        officialName: country.name?.official || country.name?.common || "",
        code: country.cca2 || currencyKey || "",
        capital: Array.isArray(country.capital) ? country.capital[0] : (country.capital || "No capital"),
        continents: Array.isArray(country.continents) ? country.continents[0] : (country.continents || country.region || ""),
        latlng: country.latlng || [0, 0],
        area: country.area || 0,
        population: country.population || 0,
        flag: country.flags?.png || country.flags?.svg || (country.cca2 ? `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png` : ""),
        languages: Array.isArray(country.languages) ? country.languages : Object.values(country.languages || {}),
        currency: currency ? {
            code: currencyKey,
            name: currency.name,
            symbol: currency.symbol,
        } : null,
    };
};

const findInList = (list, query) => {
    if (!Array.isArray(list) || !query) return null;
    const norm = normalize(query);
    if (!norm) return null;

    // 1. Exact match on common name, official name, cca2, or cca3
    const exact = list.find(c =>
        normalize(c.name?.common) === norm ||
        normalize(c.name?.official) === norm ||
        normalize(c.cca2) === norm ||
        normalize(c.cca3) === norm
    );
    if (exact) return exact;

    // 2. Starts with / includes match
    return list.find(c => {
        const cCommon = normalize(c.name?.common);
        const cOfficial = normalize(c.name?.official);
        return (cCommon && (cCommon.includes(norm) || norm.includes(cCommon))) ||
               (cOfficial && (cOfficial.includes(norm) || norm.includes(cOfficial)));
    }) || null;
};

export const fetchCountryDetails = async (countryName) => {
    if (!countryName) throw new Error("Country name is required");

    // 1. Check local curated data first (instant 0ms)
    const localMatch = findInList(staticCountries, countryName);
    if (localMatch) {
        return formatCountryResult(localMatch);
    }

    // 2. If not found in static list, check or fetch CDN dataset
    try {
        if (!remoteCountriesCache) {
            const res = await fetch("https://cdn.jsdelivr.net/gh/mledoze/countries@master/countries.json");
            if (res.ok) {
                remoteCountriesCache = await res.json();
            }
        }

        if (remoteCountriesCache) {
            const remoteMatch = findInList(remoteCountriesCache, countryName);
            if (remoteMatch) {
                return formatCountryResult(remoteMatch);
            }
        }
    } catch (err) {
        console.warn("Could not fetch remote countries list:", err);
    }

    throw new Error("Country not found");
};
