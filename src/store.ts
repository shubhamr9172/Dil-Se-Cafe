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

export const useStore = create<AppState>((set) => ({
    menuItems: [],
    categories: [],
    orders: [],

    addMenuItem: (item) => {
        dbService.addMenuItem(item);
    },

    addCategory: (category) => {
        dbService.addCategory(category);
    },

    updateMenuItem: (id, updatedItem) => {
        // dbService.updateMenuItem(id, updatedItem);
        console.log("Update not implemented yet", id, updatedItem);
    },

    deleteMenuItem: (id) => {
        dbService.deleteMenuItem(id);
    },

    addOrder: (order) => {
        dbService.addOrder(order);
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
