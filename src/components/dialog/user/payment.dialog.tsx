"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore, useCartStore } from "@/utils/store";
import Button from "@/components/ui/button/Button";
import { fetcherSWR, formatNumber } from "@/lib/helpers";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { API_BASE_URLS, PAYMENT_METHODS } from "@/lib/constants";

export default function PaymentDialog({ open, onClose, onSubmit }: any) {
    const { t } = useTranslation();
    const { items, getTotal, getPrice } = useCartStore();
    const [dataVouchers, setDataVouchers] = useState<VoucherType[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("momo");
    const [selectedOrderVoucher, setSelectedOrderVoucher] = useState(-1);
    const [selectedShippingVoucher, setSelectedShippingVoucher] = useState(-1);
    const user = useAuthStore((state) => state.user);

    const { data: data, isLoading: loading } = useSWR(
        API_BASE_URLS.GUEST + "vouchers/payment/get/",
        fetcherSWR
    );

    useEffect(() => {
        if (data) {
            setDataVouchers(data.data);
        }
    }, [data]);

    const shippingFee = useMemo(() => {
        if (selectedShippingVoucher !== -1) {
            return 0;
        }
        return 15000;
    }, [selectedShippingVoucher]);

    const total = useMemo(() => {
        let totalProduct = getTotal();
        return shippingFee + totalProduct - (selectedOrderVoucher !== -1
            ? dataVouchers.find((v) => v.id === selectedOrderVoucher)?.discount_type === "percent"
                ? (totalProduct * Number(dataVouchers.find((v) => v.id === selectedOrderVoucher)?.discount_value)) / 100
                : Number(dataVouchers.find((v) => v.id === selectedOrderVoucher)?.discount_value)
            : 0);

    }, [selectedShippingVoucher, selectedOrderVoucher]);

    const handleClose = () => {
        setPaymentMethod("momo");
        setSelectedOrderVoucher(-1);
        setSelectedShippingVoucher(-1);
        onClose();
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative p-6 w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-visible">
                {/* Title */}
                <button onClick={() => handleClose()} type="button" 
                    className="absolute cursor-pointer top-[-11] right-[-11] text-gray-400 bg-gray-200 hover:bg-gray-200 
                    hover:text-gray-900 text-sm w-6 h-6 ms-auto inline-flex justify-center items-center 
                    rounded-full shadow-none outline-none" data-modal-hide="default-modal">
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
                <h2 className="text-xl font-bold mb-3 text-center text-blue-500">{t("Payment")}</h2>

                {/* Product list */}
                <div className="space-y-2">
                    {items.map((item: any) => (
                        <div key={item.id} className="flex justify-between border-b border-gray-300 pb-2">
                            <div>
                                <p className="font-semibold">{item.product.name}</p>
                                <p className="text-sm text-gray-500">
                                x{item.quantity}
                                </p>
                            </div>
                            <div className="text-pink-500">
                                {formatNumber((getPrice(item) * item.quantity).toString())} đ
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 grid grid-cols-12 gap-4">
                    {/* Delivery address */}
                    <div className="col-span-12">
                        <p className="font-semibold mb-1">{t("Delivery address")}</p>
                        <div className="grid grid-cols-12 gap-3">
                            <p className="col-span-12">
                                {user?.address || t("No delivery address available")}
                            </p>
                        </div>
                    </div>

                    {/* Payment method */}
                    <div className="col-span-6">
                        <p className="font-semibold mb-1">{t("Payment method")}</p>
                        <div className="space-y-2">
                            <select
                                className="w-full border p-2 rounded"
                                value={paymentMethod || ""}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                {PAYMENT_METHODS.map(payment => (
                                    <option key={payment.value} value={payment.value}>
                                        {payment.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Shipment */}
                    <div className="col-span-6">
                        <p className="font-semibold mb-1">{t("Shipment")}</p>
                        <div className="">
                            <p className="text-sm text-pink-500">
                                {t("Delivery within 30-45 minutes.")}
                            </p>
                            <p className="text-sm">
                                {t("Shipping fee:")} 
                                <span className="text-pink-500">
                                    {shippingFee ? formatNumber(shippingFee.toString()) + " đ" : " Free"}
                                </span> 
                            </p>
                        </div>
                    </div>
                </div>

                {/* Voucher */}
                <div className="mt-4 grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <p className="font-semibold mb-1">{t("Order Voucher")}</p>
                        <select
                            className="w-full border p-2 rounded"
                            value={selectedOrderVoucher || -1}
                            onChange={(e) => setSelectedOrderVoucher(parseInt(e.target.value))}
                        >
                            <option value="-1">-- Select order voucher --</option>
                            {dataVouchers
                                .filter(v => v.voucher_type === "order" && v.min_order_value <= getTotal())
                                .map(voucher => (
                                    <option key={voucher.id} value={voucher.id}>
                                        {voucher.code} - {voucher.discount_type === "percent"
                                            ? `${parseInt(voucher.discount_value.toString())}%`
                                            : `${formatNumber(voucher.discount_value)} đ`}
                                    </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-span-6">
                        <p className="font-semibold mb-1">{t("Shipping Voucher")}</p>
                        <select
                            className="w-full border p-2 rounded"
                            value={selectedShippingVoucher || -1}
                            onChange={(e) => setSelectedShippingVoucher(parseInt(e.target.value))}
                        >
                            <option value="-1">-- Select shipping voucher --</option>
                            {dataVouchers
                                .filter(v => v.voucher_type === "shipping" && v.min_order_value <= getTotal())
                                .map(voucher => (
                                    <option key={voucher.id} value={voucher.id}>
                                        {voucher.code}
                                    </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Total */}
                <div className="mt-4 font-bold flex justify-between">
                    <span>{t("Total Amount:")}</span>
                    <span className="text-pink-500">
                        {formatNumber(total.toString())} đ
                    </span>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        size="sm"
                        className="text-white mt-2 text-lg hover:bg-blue-600 rounded-lg bg-blue-500 !p-2 cursor-pointer"
                        onClick={() => {
                            onSubmit({
                                payment_method: paymentMethod,
                                delivery_address: user?.address || "",
                                shipping_voucher: selectedShippingVoucher,
                                order_voucher: selectedOrderVoucher,
                            });
                        }}
                        >
                            {t("Confirm Payment")}
                    </Button>
                </div>
            </div>
        </div>
    );
}