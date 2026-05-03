'use client';

import Button from "@/components/ui/button/Button";
import { formatNumber } from "@/lib/helpers";
import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuthStore, useCartStore } from "@/utils/store";
import { useTranslation } from "react-i18next";
import { API_BASE_URLS } from "@/lib/constants";

interface Props {
  isOpen: boolean;
  setIsOpen: (value:boolean) => void ;
  selectProduct: ProductType|null;
}

export default function OrderProductDialog(props: Props) {
    const { t } = useTranslation();
    const {isOpen, setIsOpen, selectProduct} = props
    const [selectedOptions, setSelectedOptions] = useState<{[groupId: number]: number;}>({});
    const [selectedTopping, setSelectedTopping] = useState<ToppingType[]>([]);
    const [quantity, setQuantity] = useState<number>(1)
    const addItemCart = useCartStore(state => state.addItem);

    const handleCloseDialog = () => {
        setIsOpen(false);
        setSelectedTopping([]);
        setSelectedOptions({});
        setQuantity(1);
    }

    const handleSubmit = async () => {
        if (!selectProduct) return;

        const item = {
            id: crypto.randomUUID(),
            product: selectProduct,
            quantity: quantity,
            base_price: Number(selectProduct.price),
            options: Object.entries(selectedOptions).map(([groupId, optionId]) => ({
                group_id: Number(groupId),
                option_id: optionId
            })),
            
            toppings: selectedTopping.map(t => ({
            id: t.id,
            name: t.name,
            price: Number(t.price),
            quantity: 1
            }))
        };

        const user = useAuthStore.getState().user;
        if (!user) {
            addItemCart(item);
        } else {
            try {
                const res = await fetch(
                    API_BASE_URLS.GUEST + "cart/add/",
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(item),
                    }
                );

                if (!res.ok) throw new Error("Add cart failed");

                const data = await res.json();

                useCartStore.setState({
                    items: data.items
                });
            } catch (err) {
                console.error(err);
                addItemCart(item);
            }
        }

        handleCloseDialog();
    };


    const toggleOption = (optionId: number, groupId: number) => {
        setSelectedOptions(prev => ({
            ...prev,
            [groupId]: optionId
        }));
    };

    const toggleOne = (item: ToppingType) => {
        setSelectedTopping(prev => {
            const exists = prev.some(t => t.id === item.id);
            if (exists) {
                return prev.filter(t => t.id !== item.id);
            }
            return [...prev, item];
        });
    };

    const total = useMemo(() => {
        if (!selectProduct) return 0;

        const basePrice = Number(selectProduct.price);

        const optionPrice = selectProduct.option_groups?.reduce((sum: number, group: any) => {
            const selectedId = selectedOptions[group.id];
            const opt = group.options.find((o: any) => o.id === selectedId);
            return sum + (opt?.price || 0);
        }, 0);

        const toppingPrice = selectedTopping.reduce((sum, t) => {
            return sum + Number(t.price || 0);
        }, 0);

        return (basePrice + optionPrice + toppingPrice) * quantity;
    }, [selectProduct, selectedOptions, quantity, selectedTopping]);


    return(
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-visible">
                <div className="items-center gap-3 px-4 py-4">
                    <button onClick={() => handleCloseDialog()} type="button" 
                        className="absolute cursor-pointer top-[-11] right-[-11] text-gray-400 bg-gray-200 hover:bg-gray-200 
                        hover:text-gray-900 text-sm w-6 h-6 ms-auto inline-flex justify-center items-center 
                        rounded-full shadow-none outline-none" data-modal-hide="default-modal">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>

                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-5">
                            <div className="border border-gray-400 rounded-xl h-full items-center justify-center">
                                <img
                                    src={API_BASE_URLS.ADMIN_MEDIA + (selectProduct?.image ?? "")}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            
                            
                        </div>
                        <div className="col-span-7 w-full items-center justify-center">
                            <div>
                                <h2 className="text-lg font-semibold">{selectProduct?.name}</h2>
                                <div className="flex justify-between">
                                    <p className="text-pink-400 font-bold flex items-center">
                                        {formatNumber(selectProduct?.price ? selectProduct?.price.toString() : "")} VNĐ
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-7 h-7 bg-blue-500 text-white rounded cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span>{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="w-7 h-7 bg-blue-500 text-white rounded cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {selectProduct?.option_groups?.map((group: any) => (
                                    <div key={group.id}>
                                        <p className="font-medium mb-0.5 mt-2">{group.name}</p>

                                        <div className="flex flex-wrap gap-3">
                                        {group.options.map((opt: any) => {
                                            const isActive = selectedOptions[group.id] === opt.id;

                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => toggleOption(opt.id, group.id)}
                                                    className={`
                                                    px-3 py-1 rounded-lg border text-sm transition cursor-pointer
                                                    ${isActive 
                                                        ? "bg-pink-500 text-white border-pink-500" 
                                                        : "bg-white text-gray-700 border-gray-300 hover:border-pink-400"}
                                                    `}
                                                >
                                                    {opt.name}
                                                    {opt.price > 0 && (
                                                    <span className={`ml-1 text-xs text-pink-400 ${isActive 
                                                        ? "text-white" : "text-pink-400"
                                                    }`}>
                                                        +{formatNumber(opt.price)}đ
                                                    </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {
                                selectProduct?.toppings.length &&
                                <div className="border-t border-gray-400 mt-2 max-h-72 overflow-y-auto">
                                    <h4 className="text-lg w-full font-semibold dark:text-white mt-2 pb-2 ">
                                        Toppings
                                    </h4>

                                    <div className="max-h-65 overflow-y-auto space-y-2">
                                        {selectProduct?.toppings.map((item) => (
                                            <div key={item.id} className="flex gap-2 items-center">
                                                <div>
                                                    <input
                                                    type="checkbox"
                                                    checked={selectedTopping.some(t => t.id === item.id)}
                                                    onChange={() => toggleOne(item)}
                                                    />
                                                </div>
                                                <div>
                                                    <img
                                                        src={API_BASE_URLS.ADMIN_MEDIA + (item.image ?? "")}
                                                        className="w-8 h-8 object-contain transition-transform duration-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm">
                                                        {item.name}
                                                    </label>
                                                    <label className="flex items-center gap-2 text-xs text-pink-400">
                                                        {formatNumber(item.price.toString())} VNĐ
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    <Button
                      startIcon={<ShoppingCart size={18} />}
                      size="sm"
                      className="text-white mt-2 text-lg w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white !p-2 cursor-pointer"
                      onClick={() =>{
                        handleSubmit()
                      }}
                    >
                      {t("Add To Cart")}: {formatNumber(total.toString())} VNĐ
                    </Button>
                </div>
            </div>
        </div>
    )
}