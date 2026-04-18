import { useAuthStore } from "@/utils/store";
import { useEffect, useState } from "react";
import { AuthService } from "@/services";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const clearUser = useAuthStore((s) => s.clearUser);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const data = await AuthService.getCurrentUser();

                if (data.user?.id) {
                    setUser(data.user as any);
                } else {
                    setUser(null);
                }
            } catch (error) {
                clearUser();
            } finally {
                setIsLoading(false);
            }
        };

        fetchMe();
    }, [setUser, clearUser]);

    return {
        user,
        isLoading,
        setUser,
        clearUser,
        isAuthenticated: !!user?.id,
    };
};
