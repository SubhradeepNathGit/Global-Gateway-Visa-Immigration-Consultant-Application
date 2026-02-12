import { useQuery } from "@tanstack/react-query";
import { fetchPassportByApplicationId } from "../../functions/getApplicationPassportDetails";

export const usePassportByApplicationId = (application_id) => {
    // console.log('Application id for fetching passport data in hook', application_id);

    return useQuery({
        queryKey: ["passport", application_id],
        queryFn: () => fetchPassportByApplicationId(application_id),
        enabled: !!application_id,
    });
};
