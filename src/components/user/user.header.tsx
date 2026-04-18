"use client"

import Link from 'next/link';
import { useEffect, useRef, useState } from "react"
import { XMarkIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { useAuthStore, useCartStore} from '@/utils/store';
import Image from "next/image";
import { LanguageDropdown } from './user.language';
import { API_BASE_URLS } from "@/lib/constants";
import { AuthService, ProductService } from "@/services";
import { AvatarUser } from '@/app/auth/callback/page';
import AppSearch from './user.search';
import { ShoppingCart, UserCircleIcon } from 'lucide-react';
import useSWR from 'swr';
import { fetcherSWR } from '@/lib/helpers';

type NavItem = {
    href: string;
    label: string;
    children?: {
        href: string;
        label: string;
    }[];
};

const Header = () => {
    const user = useAuthStore((state) => state.user);
    const { getQuantity, clear } = useCartStore();
    const pathname = usePathname();
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

    const [navItems, setNavItems] = useState<NavItem[]>([
        { href: "/", label: "Home" },
    ]);

    const { data} = useSWR(
        API_BASE_URLS.GUEST + "home/categories/get/",
        fetcherSWR
    );

    useEffect(() => {
        if (data) {
            const menuChildren = data.data.map((cat: any) => ({
                href: `/menu/${cat.slug}`,
                label: cat.name,
            }));

            setNavItems([
                { href: "/", label: "Home" },
                {
                    href: "/menu/",
                    label: "Menu",
                    children: menuChildren,
                },
            ]);
        }
    }, [data]);

    const handleLogout = async () =>{
        try {
            await AuthService.logout();
            setMenuOpen(false)
            clearUser();
            clear()
            localStorage.removeItem("justLoggedIn")
            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
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
                                width={120}
                                height={50}
                                className="dark:hidden"
                                src="/logo.png"
                                alt="Logo"
                            />
                        </Link>
                        <nav className="flex gap-6">
                            {navItems.map((item) => (
                                <div key={item.label} className="relative group">
                                    <Link href={item.href}  className='hover:text-blue-400'>
                                        {item.label}
                                    </Link>

                                    {item.children && (
                                        <div className=" border border-gray-400 absolute left-0 top-full hidden group-hover:block bg-white shadow-lg w-50 z-50">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block px-4 py-2 hover:text-white hover:bg-blue-400"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-2">
                        <AppSearch headerHeight={headerHeight}/>
                        <div className="hidden md:flex mr-2 relative">
                            <button className='text-gray-500 cursor-pointer hover:bg-pink-500 hover:text-white p-1 rounded-xl'
                                onClick={() => router.push("/cart/")}
                            >
                                <span className="flex items-center"><ShoppingCart size={23} /></span>
                            </button>
                            <div className='absolute w-5 h-5 text-center text-white bg-pink-500 rounded-full top-[-5] right-[-5]'>
                                {getQuantity()}
                            </div>
                        </div>
                        <div className="hidden md:flex gap-6 p-[2px] bg-[#cccccc]">
                            <LanguageDropdown />
                        </div>
                        <div className="relative inline-block text-left" ref={menuRef}>
                            <button className="cursor-pointer flex text-gray-500" onClick={ () => handleLogin() }>
                                {!user 
                                    ? <UserCircleIcon className="w-8 h-8" /> 
                                    : <AvatarUser name={user?.full_name?.trim() || user?.email || "A"} w={8} h={8}/>
                                }
                            </button>
                            {menuOpen && (
                                <div
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none 
                                    transition-all duration-200 ease-in-out opacity-100 group-hover:opacity-100"
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
                    <nav className="md:hidden flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${
                                    pathname === item.href
                                        ? "text-pink-500 font-semibold"
                                        : "text-gray-700 dark:text-gray-300"
                                } hover:text-pink-500`}
                            >
                                {t(item.label)}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </div>
    );
};

export default Header;