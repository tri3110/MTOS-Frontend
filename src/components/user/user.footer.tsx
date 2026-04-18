"use client"

import { fetcherSWR } from "@/lib/helpers";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { API_BASE_URLS } from "@/lib/constants";

const Footer = () => {

    const [dataStore, setDataStore] = useState<StoreType[]>([]);

    const { data} = useSWR(
        API_BASE_URLS.GUEST + "stores/user/get/",
        fetcherSWR
    );

    useEffect(() => {
        if (data) {
            setDataStore(data.data)
        }
    }, [data]);

    return (
        <div className="w-full border-t border-gray-300 bg-gray-800 text-white">
            <div className="max-w-screen-xl mx-auto px-4">
                <footer className="flex justify-between py-4">
                    <div className="gap-1">
                        {dataStore.map((item) => (
                            <div key={item.id} className="flex flex-col text-sm mb-3">
                                <span className="font-semibold">{item.name}</span>
                                <span>📍 {item.address}  📞 {item.phone}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <iframe
                            src="https://www.google.com/maps?q=10.8462129,106.7508666&output=embed"
                            width="350"
                            height="250"
                            style={{ border: 0 }}
                            loading="lazy"
                            className="rounded-md"
                        ></iframe>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Footer;