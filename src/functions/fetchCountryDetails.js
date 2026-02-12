import { endPoint_Country } from "../api/api_url/apiUrl";
import axiosInstance_country from "../api/axiosInstance/axiosInstance";

export const fetchCountryDetails = async (countryName, fullText = true) => {
    // console.log('Request data for country named', countryName);

    try {
        const response = await axiosInstance_country.get(`${endPoint_Country}/${encodeURIComponent(countryName)}`,
            { params: { fullText } }
        );

        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Country not found");
        }

        // console.log(data);

        const country = data[data.length - 1];

        // console.log('Country details response', country);

        const currencyKey = Object.keys(country.currencies || {})[0];
        const currency = country.currencies?.[currencyKey];

        return {
            officialName: country.name?.official,
            capital: country.capital?.[0] || "No capital",
            continents: country.continents?.[0],
            latlng: country.latlng,
            area: country.area,
            population: country.population,
            flag: country.flags?.png,
            languages: Object.values(country.languages || {}),
            currency: currency ? {
                code: currencyKey,
                name: currency.name,
                symbol: currency.symbol,
            } : null,
        };
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Country not found");
        }

        throw new Error(
            error.response?.data?.message || "Failed to fetch country"
        );
    }
};
