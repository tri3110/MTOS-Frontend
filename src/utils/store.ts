import { create } from 'zustand';
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
        }),
        {
        name: "auth-storage",
        }
    )
);

const isSame = (a:any, b:any) => {
    return (
        a.product_id === b.product_id &&
        JSON.stringify(a.options) === JSON.stringify(b.options) &&
        JSON.stringify(a.toppings) === JSON.stringify(b.toppings)
    );
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
        items: [],

        cartId: null,

        setCartId: (id) => set({ cartId: id }),
        
        setItems: (items) => set({ items }),

        addItem: (item) =>
            set((state) => {
            const existingIndex = state.items.findIndex(i => isSame(i, item));

            let newItems;

            if (existingIndex !== -1) {
                newItems = [...state.items];
                newItems[existingIndex].quantity += item.quantity;
            } else {
                newItems = [...state.items, item];
            }

            return { items: newItems };
            }),

        removeItem: (id: string) =>
            set((state) => ({
                items: state.items.filter(i => i.id !== id),
            })),

        increaseQuantity: (itemUpdate) =>
            set((state) => ({
                items: state.items.map(item =>
                    item.id === itemUpdate.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
            })),

        decreaseQuantity: (itemUpdate) =>
            set((state) => ({
                items: state.items
                    .map(item =>
                    item.id === itemUpdate.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                    )
                    .filter(item => item.quantity > 0),
            })),

        getQuantity: () =>
            get().items.reduce((sum, item) => sum + item.quantity, 0),

        getPrice: (item) => { 
            const basePrice = Number(item.product.price); 
            const optionPrice = item.product.option_groups?.reduce((sum: number, group: any) => { 
            const selectedId = item.options[group.id]; const opt = group.options.find((o: any) => o.id === selectedId); 
                return sum + (opt?.price || 0); 
            }, 0); 

            const toppingPrice = item.toppings.reduce((sum, t) => { 
                return sum + Number(t.price || 0); 
            }, 0); 

            return (basePrice + optionPrice + toppingPrice); 
        },

        getTotal: () => get().items.reduce((sum, item) => sum + get().getPrice(item) * item.quantity,0),

        clear: () => set({ items: [] }),}),

        {
            name: "cart-storage",
        }
    )
);

export type Notification = {
    id: string;
    title: string;
    message: string;
    level: "info" | "success" | "warning" | "error";
    created_at: string;
};

type State = {
    notifications: Notification[];
    add: (n: Notification) => void;
    remove: (id: string) => void;
    clear: () => void;
};

export const useNotificationStore = create<State>((set) => ({
    notifications: [],

    add: (n) =>
        set((state) => ({
            notifications: [n, ...state.notifications],
        })),

    remove: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    clear: () => set({ notifications: [] }),
}));