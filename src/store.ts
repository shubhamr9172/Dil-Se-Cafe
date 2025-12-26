import { create } from 'zustand';
import type { MenuItem, Order, Category } from './types';
import { dbService } from './services/db';

interface AppState {
    menuItems: MenuItem[];
    categories: Category[];
    orders: Order[];

    // Actions
    addMenuItem: (item: MenuItem) => void;
    updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
    deleteMenuItem: (id: string) => void;

    addCategory: (category: Category) => void;

    addOrder: (order: Order) => void;
    updateOrderStatus: (id: string, status: Order['status']) => void;

    // Sync Actions
    setMenuItems: (items: MenuItem[]) => void;
    setCategories: (categories: Category[]) => void;
    setOrders: (orders: Order[]) => void;

    // specific for Auth
    user: any | null;
    setUser: (user: any | null) => void;
    logout: () => void;
}

export const useStore = create<AppState>((set, get) => ({
    menuItems: [],
    categories: [],
    orders: [],

    addMenuItem: (item) => {
        const user = get().user;
        if (user?.uid) {
            dbService.addMenuItem(user.uid, item);
        }
    },

    addCategory: (category) => {
        const user = get().user;
        if (user?.uid) {
            dbService.addCategory(user.uid, category);
        }
    },

    updateMenuItem: (id, updatedItem) => {
        dbService.updateMenuItem(id, updatedItem);
    },

    deleteMenuItem: (id) => {
        dbService.deleteMenuItem(id);
    },

    addOrder: (order) => {
        const user = get().user;
        if (user?.uid) {
            dbService.addOrder(user.uid, order);
        }
    },

    updateOrderStatus: (id, status) => {
        dbService.updateOrderStatus(id, status);
    },

    // Sync Actions
    setMenuItems: (items) => set({ menuItems: items }),
    setCategories: (categories) => set({ categories }),
    setOrders: (orders) => set({ orders }),

    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
