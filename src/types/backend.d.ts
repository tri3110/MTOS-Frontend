export { };

declare global {

    interface ProductType{
        id: number,
        name: string,
        image: string | null,
        price: number,
        category: CategoryType,
        toppings: ToppingType[],
        option_groups: OptionGroupType[],
        purchase_count: number,
        deleted_at: string | null
    }

    interface ToppingType{
        id: number,
        name: string,
        image: string | null,
        price: number,
        max_quantity: number,
        is_required: boolean
    }

    interface OptionGroupType {
        id: number;
        name: string;
        is_multiple: boolean;
        options: OptionProductType[];
    }

    interface OptionProductType{
        id: number,
        name: string,
        price: number,
        is_required: boolean
    }

    interface CategoryType{
        id: number,
        name: string,
        slug: string,
    }

    interface SliderType{
        id: number,
        title: string,
        image: string | null,
        link: string,
        order: number,
    }

    interface CartItem {
        id: string;
        product: ProductType;
        quantity: number;
        base_price: number;
        options: { [groupId: number]: number };
        toppings: {
            id: number;
            name: string;
            price: number;
            quantity: number;
        }[];
    }

    interface CartStore {
        items: CartItem[];
        cartId: string | null;
        setCartId: (id: string) => void;
        addItem: (item: CartItem) => void;
        setItems: (items: CartItem[]) => void;
        removeItem: (id: string) => void;
        getQuantity: () => number;
        getPrice: (item: CartItem) => number;
        getTotal: () => number;
        increaseQuantity: (item: CartItem) => void,
        decreaseQuantity: (item: CartItem) => void,
        clear: () => void;
    }

    interface VoucherType {
        id?: number,
        code: string;
        discount_type: "percent" | "fixed";
        voucher_type: "order" | "shipping";
        discount_value: number;
        max_usage: number;
        used_count?: number;
        expired_at: string;
        min_order_value: number,
        is_active: boolean,
    }

    interface StoreType {
        id?: number,
        name: string;
        address: string;
        phone: string;
    }

    export interface OrderItemToppingType {
        id: number;
        topping: number;
        price: number;
        quantity: number;
    }

    export interface OrderItemType {
        id: number;
        product: number;
        price: number;
        quantity: number;
        toppings: OrderItemToppingType[];
    }

    export enum PaymentMethod {
        COD = "cod",
        MOMO = "momo",
        VNPAY = "vnpay",
        ZALOPAY = "zalopay",
    }

    export interface OrderType {
        id: number;
        user: number;
        store: number;
        voucher: number | null;

        customer_name: string;
        total_price: number;
        earned_points: number;

        status: string;
        payment_method: PaymentMethod;
        idempotency_key: string | null;

        payment_url: string | null;
        qr_code: string | null;

        created_at: string;

        items: OrderItemType[];
    }

    interface OptionType{ 
        label: string; 
        value: number 
    };

    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }
    
    interface ILogin{
        user:{
            id : string;
            email: string;
            full_name: string;
            phone: string;
            role: string;
            avatar: string;
            is_staff_member: boolean;
            is_admin: boolean;
        },
        access_token: string;
        refresh_token: string;
    }

    interface IRegister{
        _id : string;
    }

    interface User {
        id: number;
        full_name: string;
        email: string;
        is_admin: boolean;
        is_staff_member: boolean;
        phone: string;
        role: string;
        avatar: string;
        address: string;
    };

    interface AuthState {
        user: User | null;
        setUser: (user: User|null) => void;
        clearUser: () => void;
    };
}
