import { API_BASE_URLS } from "@/lib/constants";

export interface CartItem {
    id: number;
    product: {
        id: number;
        name: string;
        image?: string;
        [key: string]: any;
    };
    quantity: number;
    [key: string]: any;
}

export interface CartResponse {
    items: CartItem[];
}

export interface PaymentRequest {
    [key: string]: any;
}

export interface PaymentResponse {
    order_id: string;
    [key: string]: any;
}

export interface OrderResponse {
    [key: string]: any;
}

export class CartService {
    static async syncCart(items: CartItem[]): Promise<CartResponse> {
        const response = await fetch(API_BASE_URLS.GUEST + "cart/sync/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ items }),
        });

        if (!response.ok) {
            throw new Error("Failed to sync cart");
        }

        return response.json();
    }

    static async getCart(): Promise<CartResponse> {
        const response = await fetch(API_BASE_URLS.GUEST + "cart/get/", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to get cart");
        }

        return response.json();
    }

    static async deleteCartItem(itemId: number): Promise<void> {
        const response = await fetch(API_BASE_URLS.GUEST + `cart/delete/${itemId}/`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete cart item");
        }
    }

    static async updateCartItem(itemId: number, data: any): Promise<void> {
        const response = await fetch(API_BASE_URLS.GUEST + `cart/update/${itemId}/`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to update cart item");
        }
    }

    static async createPayment(data: PaymentRequest): Promise<PaymentResponse> {
        const response = await fetch(API_BASE_URLS.GUEST + "payment/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create payment");
        }

        return response.json();
    }

    static async getOrder(orderId: string): Promise<OrderResponse> {
        const response = await fetch(`${API_BASE_URLS.GUEST}orders/${orderId}`, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to get order");
        }

        return response.json();
    }

    static async handleMomoIPN(data: any): Promise<any> {
        const response = await fetch(API_BASE_URLS.GUEST + "momo-ipn/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to handle MoMo IPN");
        }

        return response.json();
    }
}