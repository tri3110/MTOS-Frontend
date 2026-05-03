"use client"

import Button from "@/components/ui/button/Button";
import { formatNumber } from "@/lib/helpers";
import { useAuthStore, useCartStore } from "@/utils/store";
import { API_BASE_URLS } from "@/lib/constants";
import { CartService } from "@/services";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useState } from "react";
import PaymentDialog from "@/components/dialog/user/payment.dialog";

export default function Cart() {
    const { t } = useTranslation();
    const { items, removeItem, getPrice, getTotal, increaseQuantity, decreaseQuantity } = useCartStore();
    const [openPayment, setOpenPayment] = useState(false);
    const user = useAuthStore.getState().user;
    const router = useRouter();

    const handleRemove = async (id: string) => {

        if (!user) {
            removeItem(id);
            return;
        }

        try {
            await CartService.deleteCartItem(Number(id));

            // Update local state after successful deletion
            const currentItems = useCartStore.getState().items;
            const updatedItems = currentItems.filter(item => item.id !== id);
            useCartStore.setState({ items: updatedItems });

        } catch (err) {
            console.error(err);
        }
    };

    const handleIncreaseAndDecrease = async (item: any, action:string) => {
        const user = useAuthStore.getState().user;

        if (!user) {
            if (action == "increase")
                increaseQuantity(item);
            else
                decreaseQuantity(item)
            return;
        }

        try {
            await CartService.updateCartItem(item.id, { action });

            const currentItems = useCartStore.getState().items;
            const updatedItems = currentItems.map(cartItem => {
                if (cartItem.id === item.id) {
                    return {
                        ...cartItem,
                        quantity: action === "increase" ? cartItem.quantity + 1 : Math.max(0, cartItem.quantity - 1)
                    };
                }
                return cartItem;
            }).filter(cartItem => cartItem.quantity > 0);
            useCartStore.setState({ items: updatedItems });

        } catch (err) {
            console.error(err);
        }
    };

    const handlePayment = async () => {
        if (!user) {
            const result = await Swal.fire({
                title: t("Login required"),
                text: t("Please log in to continue with your payment."),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t("Go to Login"),
                cancelButtonText: t("Cancel"),
            });

            if (result.isConfirmed) {
                router.push("/login");
            }

            return;
        }

        setOpenPayment(true);
    };

    const handlePaymentSubmit = async (payload: any) => {
        try {
            const data = await CartService.createPayment(payload);
            if (data.order_id) {
                let attempts = 0;
                const maxAttempts = 15;

                const interval = setInterval(async () => {
                    attempts++;

                    const dataOrder = await CartService.getOrder(data.order_id);

                    if (dataOrder.payment_url) {
                        clearInterval(interval);
                        window.location.href = dataOrder.payment_url;
                    }

                    if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        alert("Thanh toán đang chậm, vui lòng thử lại");
                    }
                }, 2000);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    
    return (
        <div>
            <div className= {`px-4 max-w-screen-xl mx-auto`}>
                <div className="p-4 grid">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between border-b border-gray-400 p-2 rounded-xl gap-3">
                            <div className="flex gap-2">
                                <div>
                                    <img
                                        src={API_BASE_URLS.ADMIN_MEDIA + (item?.product.image ?? "")}
                                        className="w-full h-32 object-contain"
                                    />
                                </div>
                                <div className="">
                                    <p className="text-lg font-semibold">{item.product.name}</p>
                                    {
                                        Object.entries(item.options).map(([groupId, optionId]) => {
                                            const option_group = item.product.option_groups.find(o => o.id === Number(groupId))
                                            const option = option_group?.options.find(o => o.id === Number(optionId));

                                            if (!option) return null;

                                            return (
                                                <p key={groupId} className="text-sm text-gray-500">
                                                    {option_group?.name} - {option.name}
                                                </p>
                                            );
                                        })
                                    }
                                    {
                                        item.toppings.map((topping)=>{
                                            return (
                                                <div className="flex" key={topping.id} >
                                                    <p className="text-sm text-gray-500">
                                                        + {topping?.name}
                                                    </p>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="flex justify-between mt-1">
                                        <div className="flex items-center border border-blue-500 rounded-lg">
                                            <button
                                                onClick={() => handleIncreaseAndDecrease(item, "decrease")}
                                                className="w-6 h-6 bg-blue-500 text-white border rounded-l-lg cursor-pointer"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleIncreaseAndDecrease(item, "increase")}
                                                className="w-6 h-6 bg-blue-500 text-white border rounded-r-lg cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-1 text-sm">
                                        <p className="text-pink-500">
                                            ({formatNumber(getPrice(item).toString())} * {item.quantity}) = {formatNumber((getPrice(item) * item.quantity).toString())} đ
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button className="h-7 w-7 top-1 cursor-pointer " onClick={() => handleRemove(item.id)}>
                                ❌
                            </button>
                        </div>
                        
                    ))}

                    <div className="flex justify-between">
                        <div className="mt-4 font-bold">
                            {t("Total Amount:")} <span className="text-pink-500">{formatNumber(getTotal().toString())} đ</span>
                        </div>
                        <Button
                            size="sm"
                            className="text-white mt-2 text-lg hover:bg-blue-600 rounded-lg bg-blue-500 !p-1 cursor-pointer"
                            onClick={() =>{
                                handlePayment()
                            }}
                            >
                                {t("Payment")}
                        </Button>
                    </div>
                </div>
            </div>
            <PaymentDialog
                open={openPayment}
                onClose={() => setOpenPayment(false)}
                onSubmit={async (payload: any) => {
                    handlePaymentSubmit(payload)
                }}
            />
        </div>
    )
}