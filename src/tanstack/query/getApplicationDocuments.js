import { useQuery } from "@tanstack/react-query";
import { getApplicationDocuments } from "../../functions/fetchApplicationDocuments";

export function useDocumentsByApplicationId(application_id) {
    // console.log('Application id for fetching documents in query', application_id);

    return useQuery({
        queryKey: ["application-documents", application_id],
        queryFn: () => getApplicationDocuments(application_id),
        enabled: Boolean(application_id),
    });
}