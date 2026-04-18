"use client"

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { API_BASE_URLS } from "@/lib/constants";
import { CartService } from "@/services";

function PaymentSuccess() {
    const router = useRouter();
    const { syncCart} = useCart();
    
    useEffect( () => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const orderId = params.get("orderId");

                if (!orderId) return;

                await CartService.handleMomoIPN({
                    orderId: orderId,
                    resultCode: 0, // giả lập thành công
                });

                await syncCart();
                router.push("/");

            } catch (error) {
                console.error("Failed to fetch schedule:", error);
            }
        };
        fetchData();
    }, []);

    return <h1>Đang xử lý thanh toán...</h1>;
}

export default PaymentSuccess;