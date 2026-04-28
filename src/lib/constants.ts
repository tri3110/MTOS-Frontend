/**
 * Application constants
 */

// API Base URLs
export const API_BASE_URLS = {
    AUTH: process.env.NEXT_PUBLIC_HTTP_AUTH,
    GUEST: process.env.NEXT_PUBLIC_HTTP_GUEST,
    ADMIN: process.env.NEXT_PUBLIC_HTTP_ADMIN,
    ADMIN_MEDIA: process.env.NEXT_PUBLIC_HTTP_ADMIN_MEDIA,
    AI: process.env.NEXT_PUBLIC_HTTP_AI,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    THEME_MODE: 'themeMode',
    THEME_DATA: 'themeData',
    I18N_LANG: 'i18nextLng',
    CART: 'cart',
    JUST_LOGGED_IN: 'justLoggedIn',
    USER_PREFS: 'userPrefs',
    ACCESS_TOKEN: 'access',
    REFRESH_TOKEN: 'refresh',
} as const;

// Theme options
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
} as const;

// Languages
export const LANGUAGES = [
    { code: 'en', label: 'EN', icon: 'fi fi-gb', border:'border-r' },
    { code: 'vi', label: 'VI', icon: 'fi fi-vn', border:'' },
] as const;

// Font sizes
export const FONT_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
} as const;

export const PAYMENT_METHODS = [
    { value: "cash", label: "Thanh toán khi nhận hàng" },
    { value: "cod", label: "Cash on Delivery" },
    { value: "momo", label: "MoMo" },
    { value: "zalopay", label: "ZaloPay" },
] as const;