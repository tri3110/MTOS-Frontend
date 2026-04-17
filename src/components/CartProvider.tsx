'use client';

import { useCartStore } from "@/utils/store";
import { useEffect } from "react";

export default function CartProvider() {
    useEffect(() => {
        const data = localStorage.getItem("cart");
        if (data) {
            useCartStore.setState({ items: JSON.parse(data) });
        }
    }, []);

    return null;
}

export const syncCart = async () => {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/admin/")) {
        return
    }

    const cart = useCartStore.getState().items;
    const justLoggedIn = localStorage.getItem("justLoggedIn");
    if (cart.length > 0 && justLoggedIn === null) {

        localStorage.setItem("justLoggedIn", "true");

        const res = await fetch(process.env.NEXT_PUBLIC_HTTP_GUEST +"cart/sync/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                items: cart 
            }),
        });
        const dataCart = await res.json();
        if (dataCart.items){
            useCartStore.setState({items: dataCart.items});
        }
    }
    else {
        const res = await fetch(
            process.env.NEXT_PUBLIC_HTTP_GUEST + "cart/get/",
            {
                credentials: "include"
            }
        );

        if (!res.ok) return;

        const data = await res.json();

        useCartStore.setState({
            items: data.items || []
        });
    }
}