import { useQuery } from "@tanstack/react-query";
import { fetchApplicationBasedonCountryIdAndVisaId } from "../../functions/fetchApplicationBasedonCountryIdAndVisaId";

export const getApplicationBasedonCountryIdAndVisaId = ({ countryId, visaId }) => {
    return useQuery({
        queryKey: ["application-stats", countryId, visaId],
        queryFn: async () => {
            const rows = await fetchApplicationBasedonCountryIdAndVisaId({ countryId, visaId });
            return rows;
        },
        enabled: Boolean(countryId && visaId),
        staleTime: 5 * 60 * 1000,
    });
}