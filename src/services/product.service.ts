import { API_BASE_URLS } from "@/lib/constants";

export interface Product {
    id: number;
    name: string;
    image?: string;
    [key: string]: any;
}

export interface Category {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Store {
    id: number;
    name: string;
    [key: string]: any;
}

export interface HomeData {
    sliders?: any[];
    categories?: Category[];
    products?: Product[];
    [key: string]: any;
}

export interface MenuResponse {
    products?: Product[];
    [key: string]: any;
}

export interface SearchResponse {
    products?: Product[];
    [key: string]: any;
}

export class ProductService {
    static async getHomeData(): Promise<HomeData> {
        const response = await fetch(API_BASE_URLS.GUEST + "home/get/", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to get home data");
        }

        return response.json();
    }

    static async getMenuProducts(): Promise<MenuResponse> {
        const response = await fetch(API_BASE_URLS.GUEST + "products/menu/", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to get menu products");
        }

        return response.json();
    }

    static async getProductBySlug(slug: string): Promise<MenuResponse> {
        const response = await fetch(`${API_BASE_URLS.GUEST}products/menu/${slug}`, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to get product by slug");
        }

        return response.json();
    }

    static async searchProducts(query: string): Promise<SearchResponse> {
        const response = await fetch(`${API_BASE_URLS.GUEST}products/search/?q=${encodeURIComponent(query)}`, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to search products");
        }

        return response.json();
    }

    static async getCategories(): Promise<{ categories: Category[] }> {
        const response = await fetch(API_BASE_URLS.GUEST + "home/categories/get/", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to get categories");
        }

        return response.json();
    }

    static async getStores(): Promise<{ stores: Store[] }> {
        const response = await fetch(API_BASE_URLS.GUEST + "stores/user/get/", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to get stores");
        }

        return response.json();
    }
}