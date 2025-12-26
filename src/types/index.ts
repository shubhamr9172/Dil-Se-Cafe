export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    isAvailable: boolean;
    type: 'veg' | 'non-veg' | 'egg';
}

export interface OrderItem extends MenuItem {
    quantity: number;
    notes?: string;
}

export interface Order {
    id: string;
    customerName?: string;
    tableNo?: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid';
    paymentMethod?: 'cash' | 'upi';
    createdAt: Date; // or Firestore Timestamp
}
