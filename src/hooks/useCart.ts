import { useCartStore, useAuthStore } from "@/utils/store";
import { useEffect } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { CartService } from "@/services";

export const useCart = () => {
    const items = useCartStore((s) => s.items);
    const setItems = useCartStore((m) => m.setItems);
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        const data = localStorage.getItem(STORAGE_KEYS.CART);
        if (data) {
            setItems(JSON.parse(data));
        }
    }, [setItems]);

    const syncCart = async (): Promise<boolean> => {
        try {
            if (typeof window === "undefined") return false;

            const pathname = window.location.pathname;
            if (pathname.startsWith("/admin/")) {
                return false;
            }

            const cart = useCartStore.getState().items;
            const justLoggedIn = localStorage.getItem(STORAGE_KEYS.JUST_LOGGED_IN);

            if (cart.length > 0 && justLoggedIn === null) {
                localStorage.setItem(STORAGE_KEYS.JUST_LOGGED_IN, "true");

                const dataCart = await CartService.syncCart(cart as any);
                if (dataCart.items) {
                    setItems(dataCart.items as any);
                    return true;
                }
            } else {
                const data = await CartService.getCart();
                setItems((data.items || []) as any);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Sync cart error:", error);
            return false;
        }
    };

    useEffect(() => {
        if (!user) return;

        const initCart = async () => {
            const currentItems = useCartStore.getState().items;
            if (currentItems.length === 0) {
                await syncCart();
            }
        };

        initCart();
    }, [user, syncCart]);

    return {
        items,
        setItems,
        syncCart,
        total: items.length,
    };
};
