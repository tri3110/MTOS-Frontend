import { API_BASE_URLS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUsers = (params: any) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: async () => {
            const res = await axios.get(
                API_BASE_URLS.AUTH + "users/get/",
                { 
                    params,
                    withCredentials: true
                }
            );
            return res.data;
        },
        placeholderData: (prev) => prev,
    });
};