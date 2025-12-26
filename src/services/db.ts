import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    where
} from 'firebase/firestore';
import type { MenuItem, Category, Order } from '../types';

// Collection References
const ITEMS_COLLECTION = 'menuItems';
const CATEGORIES_COLLECTION = 'categories';
const ORDERS_COLLECTION = 'orders';

export const dbService = {
    // --- Menu Items ---
    subscribeToMenuItems: (userId: string, callback: (items: MenuItem[]) => void) => {
        const q = query(
            collection(db, ITEMS_COLLECTION),
            where('userId', '==', userId)
        );
        return onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
            callback(items);
        });
    },

    addMenuItem: async (userId: string, item: MenuItem) => {
        const { id, ...data } = item;
        const docRef = await addDoc(collection(db, ITEMS_COLLECTION), {
            ...data,
            userId
        });
        return docRef.id;
    },

    updateMenuItem: async (id: string, updates: Partial<MenuItem>) => {
        const itemRef = doc(db, ITEMS_COLLECTION, id);
        await updateDoc(itemRef, updates);
    },

    deleteMenuItem: async (id: string) => {
        await deleteDoc(doc(db, ITEMS_COLLECTION, id));
    },

    // --- Categories ---
    subscribeToCategories: (userId: string, callback: (categories: Category[]) => void) => {
        const q = query(
            collection(db, CATEGORIES_COLLECTION),
            where('userId', '==', userId)
        );
        return onSnapshot(q, (snapshot) => {
            const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
            callback(categories);
        });
    },

    addCategory: async (userId: string, category: Category) => {
        const { id, ...data } = category;
        await addDoc(collection(db, CATEGORIES_COLLECTION), {
            ...data,
            userId
        });
    },

    // --- Orders ---
    subscribeToOrders: (userId: string, callback: (orders: Order[]) => void) => {
        const q = query(
            collection(db, ORDERS_COLLECTION),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            callback(orders);
        });
    },

    addOrder: async (userId: string, order: Order) => {
        const { id, ...data } = order;
        await addDoc(collection(db, ORDERS_COLLECTION), {
            ...data,
            userId,
            createdAt: new Date().toISOString()
        });
    },

    updateOrderStatus: async (id: string, status: Order['status']) => {
        const orderRef = doc(db, ORDERS_COLLECTION, id);
        await updateDoc(orderRef, { status });
    }
};
