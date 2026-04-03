import { useDataStore } from "@/utils/store";
import { MagnifyingGlassIcon, StarIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface SearchProps {
  headerHeight: number;
};

export default function AppSearch({ headerHeight}: SearchProps){
    const router = useRouter()
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [valueSearch, setValueSearch] = useState("");
    const [debouncedValue, setDebouncedValue] = useState("");

    const [results, setResults] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(valueSearch);
        }, 300);

        return () => clearTimeout(timer);
    }, [valueSearch]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (!debouncedValue || debouncedValue.length < 1) {
            setResults([]);
            return;
        }

        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);

                const rs = await fetch(`${process.env.NEXT_PUBLIC_HTTP_GUEST}products/search/?q=${debouncedValue}`,
                    { signal: controller.signal }
                );

                if (!rs.ok) throw new Error("Fetch error");

                const data = await rs.json();
                setResults(data);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [debouncedValue]);

    return (
        <div className="riva hidden md:flex items-center overflow-hidden">
            
            <button className="px-3 py-1 text-gray-600 text-sm" onClick={()=>setIsOpen(!isOpen)}>
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
            </button>
            {
                isOpen && 
                <div onClick={handleBackdropClick} style={{ top: headerHeight }} className="fixed inset-0 z-40 flex items-center 
                    justify-center bg-black/50 backdrop-blur-sm">
                    <div className="absolute top-1 right-4 w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-3 border-b border-gray-200">
                            <div className="relative flex items-center aspect-w-16 aspect-h-9 border border-gray-200 rounded-lg">
                                <MagnifyingGlassIcon className="absolute left-1 h-6 w-6 text-gray-600 hover:text-gray-800" />
                                <input
                                    type="text"
                                    placeholder={t("Placeholder Search")}
                                    className="w-full pl-8 px-3 py-2 text-sm text-gray-800 dark:text-white bg-transparent outline-none"
                                    onChange={(e)=>{
                                        setValueSearch(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="h-[400px] overflow-y-auto">
                            {loading && (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                { t("Loading...") }
                                </div>
                            )}

                            {!loading && results.length === 0 && debouncedValue && (
                                <div className="p-4 text-center text-gray-400 text-sm">
                                    { t("No results found") }
                                </div>
                            )}
                            {
                                results.map((product)=> (
                                    <div 
                                        key={product.id} 
                                        onClick={()=> {
                                            router.push("/detail/" + product.id);
                                            setIsOpen(false);
                                        }} 
                                        className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2 cursor-pointer border-b border-gray-200">
                                        <div className="flex items-center">
                                            <img
                                            src={process.env.NEXT_PUBLIC_HTTP_ADMIN_MEDIA + (product.image ?? "")}
                                            className="h-22 w-full object-cover rounded-md shadow-md"
                                            />
                                        </div>

                                        <div className="md:col-span-4 space-y-2">
                                            <h2 className="text-sm font-semibold">{product.name}</h2>
                                            <p className="text-sm text-gray-400">{product.price}</p>
                                            {
                                                product.purchase_count != 0 &&
                                                <span className="py-1 flex items-center gap-1">
                                                    <StarIcon className="pb-1 h-5 w-5 text-yellow-500" /> {product.purchase_count}
                                                </span>
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        
                    </div>
                </div>
            }
        </div>
    )
} 