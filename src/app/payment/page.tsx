"use client"

import { syncCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function PaymentSuccess() {
    const router = useRouter();
    
    useEffect( () => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const orderId = params.get("orderId");

                if (!orderId) return;

                const res = await fetch(process.env.NEXT_PUBLIC_HTTP_GUEST + "momo-ipn/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        resultCode: 0, // giả lập thành công
                    }),
                });

                if (res.ok){
                    await syncCart();
                    router.push("/");
                }

            } catch (error) {
                console.error("Failed to fetch schedule:", error);
            }
        };
        fetchData();
    }, []);

    return <h1>Đang xử lý thanh toán...</h1>;
}

export default PaymentSuccess;