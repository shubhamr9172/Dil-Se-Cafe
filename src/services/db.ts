import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';
import type { MenuItem, Category, Order } from '../types';

// Collection References
const ITEMS_COLLECTION = 'menuItems';
const CATEGORIES_COLLECTION = 'categories';
const ORDERS_COLLECTION = 'orders';

export const dbService = {
    // --- Menu Items ---
    subscribeToMenuItems: (callback: (items: MenuItem[]) => void) => {
        const q = query(collection(db, ITEMS_COLLECTION));
        return onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
            callback(items);
        });
    },

    addMenuItem: async (item: MenuItem) => {
        const { id, ...data } = item;
        const docRef = await addDoc(collection(db, ITEMS_COLLECTION), data);
        return docRef.id;
    },

    deleteMenuItem: async (id: string) => {
        await deleteDoc(doc(db, ITEMS_COLLECTION, id));
    },

    // --- Categories ---
    subscribeToCategories: (callback: (categories: Category[]) => void) => {
        const q = query(collection(db, CATEGORIES_COLLECTION));
        return onSnapshot(q, (snapshot) => {
            const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
            callback(categories);
        });
    },

    addCategory: async (category: Category) => {
        const { id, ...data } = category;
        await addDoc(collection(db, CATEGORIES_COLLECTION), data);
    },

    // --- Orders ---
    subscribeToOrders: (callback: (orders: Order[]) => void) => {
        const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            callback(orders);
        });
    },

    addOrder: async (order: Order) => {
        const { id, ...data } = order;
        await addDoc(collection(db, ORDERS_COLLECTION), {
            ...data,
            createdAt: new Date().toISOString()
        });
    },

    updateOrderStatus: async (id: string, status: Order['status']) => {
        const orderRef = doc(db, ORDERS_COLLECTION, id);
        await updateDoc(orderRef, { status });
    }
};
