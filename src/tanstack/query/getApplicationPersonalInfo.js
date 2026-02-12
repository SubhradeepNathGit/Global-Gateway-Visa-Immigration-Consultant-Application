import { useQuery } from "@tanstack/react-query";
import { fetchPersonalInfoByApplicationId } from "../../functions/getApplicationPersonalInfo";

export function usePersonalInfoByApplicationId(application_id) {
    // console.log('Application id for fetching personal information', application_id);

    return useQuery({
        queryKey: ["application-personal-info", application_id],
        queryFn: () => fetchPersonalInfoByApplicationId(application_id),
        enabled: !!application_id,
    });
}