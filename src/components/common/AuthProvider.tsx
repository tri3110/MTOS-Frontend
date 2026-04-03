"use client";

import { useAuthStore } from "@/utils/store";
import { useEffect } from "react";

export default function AuthProvider({children}: {children: React.ReactNode;}) {

    const setUser = useAuthStore((s) => s.setUser);
    const clearUser = useAuthStore((s) => s.clearUser);

    useEffect(() => {
        const fetchMe = async () => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_HTTP_AUTH + "me/",
            {
                credentials: "include",
            }
            );

            if (!res.ok) throw new Error();

            const data = await res.json();
            setUser(data.user);

        } catch (err) {
            clearUser();
        }
        };

        fetchMe();
    }, []);

    return children;
}