import { useEffect, useRef, useState } from "react";
import { AuthService } from "@/services";
import { useRouter } from "next/navigation";
import { useAuthStore, useCartStore, useNotificationStore } from "@/utils/store";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const clearUser = useAuthStore((s) => s.clearUser);
    const router = useRouter();
    const { clear } = useCartStore();

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

    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!user?.id) return;

        if (socketRef.current) return;

        const socket = new WebSocket(
            `ws://localhost:8000/ws/user/${user.id}/`
        );

        socketRef.current = socket;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "notification") {
                useNotificationStore.getState().add(data.payload);
            }
        };

        return () => {
            socket.close();
            socketRef.current = null;
        };
    }, [user?.id]);

    return {
        user,
        isLoading,
        setUser,
        clearUser,
        isAuthenticated: !!user?.id,
    };
};
