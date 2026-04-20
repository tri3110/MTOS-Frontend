import { API_BASE_URLS } from "@/lib/constants";
import { toast } from "react-toastify";

// Types
export interface AdminItem {
    id: number;
    [key: string]: any;
}

export interface AdminListResponse<T = AdminItem> {
    data: T[];
    [key: string]: any;
}

export interface DashboardData {
    [key: string]: any;
}

export interface DashboardResponse {
    data: DashboardData;
}

// Category Service
export class CategoryService {
    static async getCategories(): Promise<AdminListResponse> {
        const response = await fetch(API_BASE_URLS.ADMIN + "categories/get/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        return response.json();
    }

    static async createCategories(data: any, id: number): Promise<AdminListResponse> {
        const response = await fetch(
            API_BASE_URLS.ADMIN + `categories/${id ? `update/${id}/` : 'create/'}`, {
            method: id ? "PUT" : "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            toast.error(result.type[0])
        }

        return result;
    }

    static async deleteCategory(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URLS.ADMIN}categories/delete/${id}/`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete category");
        }
    }
}

// Topping Service
export class ToppingService {

    static async getToppings(): Promise<AdminListResponse> {
        const response = await fetch(API_BASE_URLS.ADMIN + "toppings/get/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch toppings");
        }

        return response.json();
    }

    static async createToppings(data: any, id: number): Promise<AdminListResponse> {
        const response = await fetch(
            API_BASE_URLS.ADMIN + `toppings/${id ? `update/${id}/` : 'create/'}`, {
            method: id ? "PUT" : "POST",
            credentials: "include",
            body: data,
        });

        const result = await response.json();
        
        if (!response.ok) {
            toast.error(result.type[0])
        }

        return result;
    }

    static async deleteTopping(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URLS.ADMIN}toppings/delete/${id}/`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete topping");
        }
    }
}

// Slider Service
export class SliderService {
    static async getSliders(): Promise<AdminListResponse> {
        const response = await fetch(API_BASE_URLS.ADMIN + "sliders/get/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch sliders");
        }

        return response.json();
    }

    static async createSlider(data: any, id: number): Promise<AdminListResponse> {
        const response = await fetch(
            API_BASE_URLS.ADMIN + `sliders/${id ? `update/${id}/` : 'create/'}`, {
            method: id ? "PUT" : "POST",
            credentials: "include",
            body: data,
        });

        const result = await response.json();
        
        if (!response.ok) {
            toast.error(result.type[0])
        }

        return result;
    }

    static async deleteSlider(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URLS.ADMIN}sliders/delete/${id}/`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete slider");
        }
    }
}

// Store Service
export class StoreService {
    static async getStores(): Promise<AdminListResponse> {
        const response = await fetch(API_BASE_URLS.ADMIN + "stores/get/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch stores");
        }

        return response.json();
    }

    static async createStore(data: any, id: number): Promise<AdminListResponse> {
        const response = await fetch(
            API_BASE_URLS.ADMIN + `stores/${id ? `update/${id}/` : 'create/'}`, {
            method: id ? "PUT" : "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.name,
                address: data.address,
                phone: data.phone
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            toast.error(result.type[0])
        }

        return result;
    }

    static async deleteStore(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URLS.ADMIN}stores/delete/${id}/`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete store");
        }
    }
}

// Product Service (Admin)
export class AdminProductService {
    static async getProducts(): Promise<AdminListResponse> {
        const response = await fetch(API_BASE_URLS.ADMIN + "products/get/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        return response.json();
    }

    static async createProduct(data: any, id: number): Promise<AdminListResponse> {
        const response = await fetch(
            API_BASE_URLS.ADMIN + `products/${id ? `update/${id}/` : 'create/'}`, {
            method: id ? "PUT" : "POST",
            credentials: "include",
            body: data,
        });

        const result = await response.json();
        
        if (!response.ok) {
            const message =
                result?.type?.[0] ||
                result?.message ||
                "Tạo sản phẩm thất bại";

            throw new Error(message);
        }

        return result;
    }

    static async deleteProduct(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URLS.ADMIN}products/delete/${id}/`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete product");
        }
    }
}

// Voucher Service
export class VoucherService {
    static async getVouchers(): Promise<AdminListResponse> {
        const response = await fetch(API_BASE_URLS.ADMIN + "vouchers/get/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch vouchers");
        }

        return response.json();
    }

    static async createVoucher(data: any, id: number): Promise<AdminListResponse> {
        const response = await fetch(
            API_BASE_URLS.ADMIN + `vouchers/${id ? `update/${id}/` : 'create/'}`, {
            method: id ? "PUT" : "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            toast.error(result.type[0])
        }

        return result;
    }

    static async deleteVoucher(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URLS.ADMIN}vouchers/delete/${id}/`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete voucher");
        }
    }
}

// Option Group Service
export class OptionGroupService {
    static async getOptionGroups(): Promise<AdminListResponse> {
        const response = await fetch(API_BASE_URLS.ADMIN + "option_group/get/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch option groups");
        }

        return response.json();
    }

    static async createOptionGroup(data: any, id: number): Promise<AdminListResponse> {
        const response = await fetch(
            API_BASE_URLS.ADMIN + `option_group/${id ? `update/${id}/` : 'create/'}`, {
            method: id ? "PUT" : "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            toast.error(result.type[0])
        }

        return result;
    }

    static async deleteOptionGroup(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URLS.ADMIN}option_group/delete/${id}/`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete option group");
        }
    }
}

// Orders Service
export class OrdersService {
    static async getOrders(): Promise<AdminListResponse> {
        const response = await fetch(API_BASE_URLS.ADMIN + "orders/get/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }

        return response.json();
    }
}

// Dashboard Service
export class DashboardService {
    static async getDashboardData(from?: string, to?: string): Promise<DashboardResponse> {
        let url = API_BASE_URLS.ADMIN + "dashboard/";
        
        if (from && to) {
            url += `?from=${from}&to=${to}`;
        }

        const response = await fetch(url, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch dashboard data");
        }

        return response.json();
    }
}
