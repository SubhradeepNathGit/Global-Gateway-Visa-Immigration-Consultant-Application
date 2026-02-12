import { useQuery } from "@tanstack/react-query";
import { fetchVisaDetailsByCountryAndVisitor } from "../../functions/fetchVisaDetailsViaCountryNameAndVisitorCountryId";

export const useVisaDetailsByCountryAndVisitor = (destinationCountryId, visitorCountryName) => {
    return useQuery({
        queryKey: ["visa-details", destinationCountryId, visitorCountryName,],
        queryFn: () =>
            fetchVisaDetailsByCountryAndVisitor({
                destinationCountryId,
                visitorCountryName,
            }),
        enabled: !!destinationCountryId && !!visitorCountryName,
        staleTime: 5 * 60 * 1000,
    });
}