import { useQuery } from "@tanstack/react-query";
import { fetchApplicationStatusData } from "../../functions/fetchApplicationStatusData";

export function useApplicationStatusData() {
    return useQuery({
        queryKey: ["applicationStatusData"],
        queryFn: fetchApplicationStatusData,
        staleTime: 1000 * 60 * 5,
    });
}
