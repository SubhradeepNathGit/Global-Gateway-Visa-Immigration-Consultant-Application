import { useQuery } from "@tanstack/react-query";
import { fetchApplicationByTxnId } from "../../functions/fetchApplicationDetailsByTxnId";

export function useApplicationByTransactionId(txn_id) {
    // console.log('Fetching application for specific transaction in hooks', txn_id);

    return useQuery({
        queryKey: ["application", txn_id],
        queryFn: () => fetchApplicationByTxnId(txn_id),
        enabled: !!txn_id,
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
    });
}
