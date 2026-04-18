'use client'

import { use, useEffect, useState } from "react";
import { fetcherSWR} from "@/lib/helpers";
import { useTheme } from "@/context/ThemeContext";
import useSWR from "swr";
import ProductsPage from "./product.provider";
import { API_BASE_URLS } from "@/lib/constants";

export default function MenuPage({ params }: { params: Promise<{ slug: string }> }){
    const { slug } = use(params);
    const { theme } = useTheme();
    const [dataProducts, setDataProducts] = useState<ProductType[]>([]);
    const [dataCategories, setDataCategories] = useState<CategoryType[]>([]);

    const { data: data, isLoading: loading } = useSWR(
        API_BASE_URLS.GUEST + "products/menu/",
        fetcherSWR
    );

    useEffect(() => {
        if (data) {
            setDataProducts(data.products);
            setDataCategories(data.categories);
        }
    }, [data]);

    return (
        <div style={{background: theme["bg-home"]}}>
            <div style={{background: theme["bg-home"]}} className= {`px-4 max-w-screen-xl mx-auto`}>
                <ProductsPage products={dataProducts} categories={dataCategories} slug={slug}/>
            </div>
        </div>
    );
}