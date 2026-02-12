import { useQuery } from "@tanstack/react-query";
import { getApplicationsByCountryId } from "../../functions/getApplicationsByCountryId";

export const useApplicationsByCountryId = (countryId, applicationStatus) => {
    //   console.log(countryId, applicationStatus);

    return useQuery({
        queryKey: ["applications", countryId, applicationStatus],
        queryFn: () => getApplicationsByCountryId({ countryId, applicationStatus }),
        enabled: !!countryId,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}