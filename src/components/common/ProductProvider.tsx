'use client'

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card/card";
import Button from "@/components/ui/button/Button";
import { ShoppingCart } from "lucide-react";
import { formatNumber } from "@/utils/common";
import OrderProductDialog from "../dialog/add.cart.dialog";

interface Props {
    product: ProductType;
}

export default function ProductPage(props: Props){
    const { t } = useTranslation();
    const {product} = props;
    const [isOpenOrderDialog, setIsOpenOrderDialog] = useState(false);
    const [selectProduct, setSelectProduct] = useState<ProductType|null>(null);

    return (
        <>
            <Card
                key={product.id}
                className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
                <CardContent className="p-4 text-center flex flex-col h-full">
                <div className="h-40 w-full bg-gray-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                    <img
                    src={process.env.NEXT_PUBLIC_HTTP_ADMIN_MEDIA + (product.image ?? "")}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300"
                    />
                </div>

                <h4 className="font-semibold text-gray-800 text-base line-clamp-2">
                    {product.name}
                </h4>

                <p className="text-pink-500 font-semibold mt-1">
                    {formatNumber(product.price.toString())} VNĐ
                </p>

                <div className="flex-1" />

                <Button
                    startIcon={<ShoppingCart size={18} />}
                    size="sm"
                    className="cursor-pointer mt-4 w-full rounded-full bg-blue-500 hover:bg-blue-600 
                    text-white font-medium shadow-md hover:shadow-lg transition"
                    onClick={() =>{
                        setIsOpenOrderDialog(true)
                        setSelectProduct(product)
                    }}
                >
                    {t("Add To Cart")}
                </Button>
                </CardContent>
            </Card>
            <OrderProductDialog 
                isOpen={isOpenOrderDialog} 
                setIsOpen={setIsOpenOrderDialog}
                selectProduct={selectProduct}
            />
        </>

    );
}