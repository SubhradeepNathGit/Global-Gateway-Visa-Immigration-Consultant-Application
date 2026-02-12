"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserId, getUserIdFromEmbassy } from "../../functions/getUserId";

export const useGetIdByEmail = (email, user_type) => {

    const encoded = email;
    const decoded = decodeURIComponent(encoded);

    // console.log('Received user email', decoded);

    return useQuery({
        queryKey: ["userId", email],
        queryFn: () => user_type == 'embassy' ? getUserIdFromEmbassy(decoded) : getUserId(decoded),
        enabled: !!email,
    });
};