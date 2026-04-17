"use client";

import { useAuthStore } from "@/utils/store";
import { useEffect } from "react";
import { syncCart } from "../CartProvider";

export default function AuthProvider({children}: {children: React.ReactNode;}) {

    const setUser = useAuthStore((s) => s.setUser);
    const clearUser = useAuthStore((s) => s.clearUser);
    
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch(
                    process.env.NEXT_PUBLIC_HTTP_AUTH + "me/",
                    {
                        credentials: "include",
                    }
                );

                if (!res.ok) throw new Error();

                const data = await res.json();

                if (data.user?.id) {
                    setUser(data.user);
                    await syncCart();
                } else {
                    setUser(null);
                }
            } catch {
                clearUser();
            }
        };

        fetchMe();
    }, []);

    return children;
}