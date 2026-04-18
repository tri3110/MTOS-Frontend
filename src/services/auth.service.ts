import { API_BASE_URLS } from "@/lib/constants";
import { AdminListResponse } from "./admin.service";

export interface AuthResponse {
    user?: {
        id: number;
        [key: string]: any;
    };
}

export interface ThemeResponse {
    themes?: any[];
}

export class AuthService {
    static async getCurrentUser(): Promise<AuthResponse> {
        const response = await fetch(API_BASE_URLS.AUTH + "me/", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        return response.json();
    }

    static async login(data: { email: string; password: string }): Promise<AdminListResponse> {
        const response = await fetch(API_BASE_URLS.AUTH + "login/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username_or_email: data.email,
                password: data.password,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to logout");
        }

        return response.json();
    }

    static async logout(): Promise<void> {
        const response = await fetch(API_BASE_URLS.AUTH + "logout/", {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to logout");
        }
    }

    static async getThemes(): Promise<ThemeResponse> {
        const response = await fetch(API_BASE_URLS.AUTH + "themes/", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch themes");
        }

        return response.json();
    }
}