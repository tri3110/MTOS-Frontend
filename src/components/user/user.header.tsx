"use client"

import Link from 'next/link';
import { useEffect, useRef, useState } from "react"
import { MagnifyingGlassIcon, XMarkIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { useAuthStore} from '@/utils/store';
import Image from "next/image";
import { LanguageDropdown } from './user.language';
import { AvatarUser } from '@/app/auth/callback/page';
import AppSearch from './user.search';

const Header = () => {
    const user = useAuthStore((state) => state.user);
    const clearUser = useAuthStore((s) => s.clearUser);
    const router = useRouter();
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const handleLogin = () =>{
        if(user?.full_name?.trim() || user?.email){
            setMenuOpen(!menuOpen);
        }
        else{
            router.push("/login");
        }
    }

    // const { data, error, isLoading } = useSWR(
    //     // process.env.NEXT_PUBLIC_BASE_URL + "main",
    //     process.env.NEXT_PUBLIC_HTTP_GUEST + "data/", 
    //     fetcher,
    //     {
    //         revalidateIfStale: false,
    //         revalidateOnFocus: false,
    //         revalidateOnReconnect: false,
    //         onSuccess: (data) => setData(data),
    //     }
    // )

    const handleLogout = async () =>{
        const response = await fetch(process.env.NEXT_PUBLIC_HTTP_AUTH + `logout/`, {
            method: "POST",
            credentials: "include"
        })

        if (response.ok) {
            clearUser();
            router.push("/");
        }
    }
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const headerRef = useRef<HTMLDivElement | null>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);

    return (
        <div ref={headerRef} className="shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900">
            <div className="max-w-screen-xl mx-auto px-4">
                <header className="flex justify-between dark:bg-gray-900">
                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? (
                            <XMarkIcon className="h-6 w-6 text-black dark:text-white" />
                        ) : (
                            <Bars3Icon className="h-6 w-6 text-black dark:text-white" />
                        )}
                    </button>
                    <div className="flex gap-6 items-center">
                        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                            <Image
                                width={70}
                                height={20}
                                className="dark:hidden"
                                src="/logo.png"
                                alt="Logo"
                            />
                        </Link>
                        <nav className="hidden md:flex gap-6">
                            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">{t("Home")}</Link>
                            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">{t("Menu")}</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2">
                        <AppSearch headerHeight={headerHeight}/>
                        <div className="hidden md:flex gap-6 p-[4px] bg-[#cccccc]">
                            <LanguageDropdown />
                        </div>
                        <div className="relative inline-block text-left" ref={menuRef}>
                            <button className="cursor-pointer" onClick={ () => handleLogin() }>
                                <AvatarUser name={user?.full_name?.trim() || user?.email || "A"} w={8} h={8}/>
                            </button>
                            {menuOpen && (
                                <div
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none transition-all duration-200 ease-in-out opacity-100 group-hover:opacity-100"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="menu-button"
                                    >
                                    <div className="py-1" role="none">
                                        {[
                                        { label: t("Profile"), href: "#" },
                                        ].map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={item.href}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                                            role="menuitem"
                                        >
                                            {item.label}
                                        </a>
                                        ))}

                                        <button
                                            type="submit"
                                            className="cursor-pointer block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                                            role="menuitem"
                                            onClick={ () => handleLogout() }
                                        >
                                            {t("SignOut")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                {mobileMenuOpen && (
                    <nav className="md:hidden flex flex-col gap-4">
                        <Link href="/home" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">{t("Home")}</Link>
                        <Link href="/home" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">{t("Film")}</Link>
                        <Link href="/home" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">{t("Cinema")}</Link>
                        <div className="flex justify-between items-center">
                            <div className="flex h-fit items-center border-1 border-gray-400 rounded-md overflow-hidden bg-white dark:bg-gray-800">
                                <input
                                    type="text"
                                    placeholder={t("Search...")}
                                    className="px-3 py-1 text-sm text-gray-800 dark:text-white bg-transparent outline-none"
                                />
                                <button className="px-3 py-1 bg-blue-500 text-white text-sm hover:bg-blue-600">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                                </button>
                            </div>
                            <LanguageDropdown />
                        </div>
                        
                    </nav>
                )}
            </div>
        </div>
    );
};

export default Header;