'use client'

import { use, useEffect, useState } from "react";
import { fetcherSWR} from "@/utils/common";
import { useTheme } from "@/context/ThemeContext";
import useSWR from "swr";
import ProductsPage from "./product.provider";

export default function MenuPage({ params }: { params: Promise<{ slug: string }> }){
    const { slug } = use(params);
    const { theme } = useTheme();
    const [dataProducts, setDataProducts] = useState<ProductType[]>([]);
    const [dataCategories, setDataCategories] = useState<CategoryType[]>([]);

    const { data: data, isLoading: loading } = useSWR(
        process.env.NEXT_PUBLIC_HTTP_GUEST + "products/menu/",
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