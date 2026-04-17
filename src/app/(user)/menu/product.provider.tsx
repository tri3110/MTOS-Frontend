'use client'

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import ProductPage from "@/components/common/ProductProvider";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface Props {
    products: ProductType[];
    categories: CategoryType[];
    slug: string | null
}

export default function ProductsPage(props: Props){
    const {products, categories, slug} = props;
    
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [active, setActive] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setActive(slug ?? null);
    }, [slug]);

    return (
        <div className={`px-4 max-w-screen-xl mx-auto py-6`}>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3">
                    <div className="bg-white rounded-xl top-20">
                        <h4 className="px-4 py-2 border-b border-gray-400"> {t("Categories")} </h4>
                        <button
                            onClick={() => {
                                setActive(null)
                                router.push(`/menu/`)
                            }}
                            className={`block w-full text-left px-4 py-2 rounded-xl cursor-pointer ${
                                active === null ? "bg-blue-500 text-white" : "hover:bg-blue-200"
                            }`}
                        >
                            {t("All")}
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActive(cat.slug)
                                    router.push(`/menu/${cat.slug}`)
                                }}
                                className={`block w-full text-left px-4 py-2 rounded-xl cursor-pointer ${
                                    active === cat.slug
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-blue-200"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6">
                        <img
                            src="/sale.png"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="col-span-9">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((p) => (
                            <div key={p.id}>
                                <ProductPage product={p}/>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}