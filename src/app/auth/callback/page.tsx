'use client';

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getColor } from "@/lib/helpers";

export default function Callback() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const access = searchParams.get("access");
        const refresh = searchParams.get("refresh");

        if (access && refresh) {
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);

            router.push("/");
        }
    }, [searchParams]);

    return <div>Loading...</div>;
}


interface AvatarProps {
  name: string;
  w: number;
  h: number;
};

export function AvatarUser({ name, w, h }: AvatarProps) {
    const initials = name?.charAt(0).toUpperCase();
    const bgColor = name ? getColor(name) : "#4f46e5";

    return (
        <div 
            className= {`h-${h} w-${w}`}
            style={{
                borderRadius: "50%",
                background: bgColor,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "25px",
            }}
        >
            {initials}
        </div>
    );
}