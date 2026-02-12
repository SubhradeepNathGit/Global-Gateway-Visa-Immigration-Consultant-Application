import { useQuery } from "@tanstack/react-query";
import { fetchVisaDetailsRaw } from "../../functions/fetchVisaDetailsRaw";
import { calculateVisaAverages } from "../../util/avgVisaConverter/visa-details/calculateVisaAverages";

export const useVisaAverages = ({ visaId, countryId }) => {
  return useQuery({
    queryKey: ["visa-averages", visaId, countryId],
    queryFn: async () => {
      const rows = await fetchVisaDetailsRaw({ visaId, countryId });
      return calculateVisaAverages(rows);
    },
    enabled: Boolean(visaId),
    staleTime: 5 * 60 * 1000,
  });
};
