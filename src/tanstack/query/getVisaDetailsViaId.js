import { useQuery } from "@tanstack/react-query";
import { fetchVisaDetailsViaId } from "../../functions/fetchVisaDetailsViaId";

export function useVisaDetailsViaId(visaId) {
    return useQuery({
        queryKey: ["visa-type-stats", visaId],
        queryFn: ()=>fetchVisaDetailsViaId(visaId),
        refetchOnWindowFocus: false,
    });
}