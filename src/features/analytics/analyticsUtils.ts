import type { Order, MenuItem, Category, OrderItem } from '../../types';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';


export type DateRange = 'today' | 'week' | 'month' | 'custom';

export interface DateFilter {
    start: Date;
    end: Date;
}

export interface AnalyticsData {
    revenue: number;
    orders: number;
    profit: number;
    averageOrderValue: number;
    topItems: { name: string; quantity: number; revenue: number }[];
    categoryBreakdown: { category: string; revenue: number; count: number }[];
    paymentMethods: { method: string; count: number; amount: number }[];
    salesByDate: { date: string; revenue: number; orders: number }[];
}

// Get date range based on filter type
export function getDateRange(range: DateRange, customStart?: Date, customEnd?: Date): DateFilter {
    const now = new Date();

    switch (range) {
        case 'today':
            return {
                start: startOfDay(now),
                end: endOfDay(now)
            };
        case 'week':
            return {
                start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
                end: endOfWeek(now, { weekStartsOn: 1 })
            };
        case 'month':
            return {
                start: startOfMonth(now),
                end: endOfMonth(now)
            };
        case 'custom':
            return {
                start: customStart || startOfDay(now),
                end: customEnd || endOfDay(now)
            };
        default:
            return {
                start: startOfDay(now),
                end: endOfDay(now)
            };
    }
}

// Filter orders by date range
export function filterOrdersByDateRange(orders: Order[], dateFilter: DateFilter): Order[] {
    return orders.filter(order => {
        const orderDate = order.completedAt ? new Date(order.completedAt) : new Date(order.createdAt);
        return isWithinInterval(orderDate, { start: dateFilter.start, end: dateFilter.end });
    });
}

// Calculate total revenue
export function calculateRevenue(orders: Order[]): number {
    return orders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.total, 0);
}

// Calculate total profit
export function calculateProfit(orders: Order[], menuItems: MenuItem[]): number {
    const paidOrders = orders.filter(order => order.paymentStatus === 'paid');

    let totalCost = 0;
    let totalRevenue = 0;

    paidOrders.forEach(order => {
        totalRevenue += order.total;

        order.items.forEach((orderItem: OrderItem) => {
            const menuItem = menuItems.find(item => item.id === orderItem.id);
            if (menuItem && menuItem.cost) {
                totalCost += menuItem.cost * orderItem.quantity;
            }
        });
    });

    return totalRevenue - totalCost;
}

// Get top selling items
export function getTopSellingItems(orders: Order[], limit: number = 10): { name: string; quantity: number; revenue: number }[] {
    const itemStats = new Map<string, { name: string; quantity: number; revenue: number }>();

    orders
        .forEach(order => {
            order.items.forEach((item: OrderItem) => {
                const existing = itemStats.get(item.id) || { name: item.name, quantity: 0, revenue: 0 };
                existing.quantity += item.quantity;
                existing.revenue += item.price * item.quantity;
                itemStats.set(item.id, existing);
            });
        });

    return Array.from(itemStats.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, limit);
}

// Get category performance
export function getCategoryPerformance(orders: Order[], categories: Category[], menuItems: MenuItem[]): { category: string; revenue: number; count: number }[] {
    const categoryStats = new Map<string, { category: string; revenue: number; count: number }>();

    // Initialize all categories
    categories.forEach(cat => {
        categoryStats.set(cat.id, { category: cat.name, revenue: 0, count: 0 });
    });

    orders
        .filter(order => order.status === 'completed')
        .forEach(order => {
            order.items.forEach((item: OrderItem) => {
                const menuItem = menuItems.find(mi => mi.id === item.id);
                if (menuItem) {
                    const stats = categoryStats.get(menuItem.categoryId);
                    if (stats) {
                        stats.revenue += item.price * item.quantity;
                        stats.count += item.quantity;
                    }
                }
            });
        });

    return Array.from(categoryStats.values())
        .filter(stat => stat.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue);
}

// Get payment method breakdown
export function getPaymentMethodBreakdown(orders: Order[]): { method: string; count: number; amount: number }[] {
    const paymentStats = new Map<string, { method: string; count: number; amount: number }>();

    orders
        .filter(order => order.paymentStatus === 'paid')
        .forEach(order => {
            const method = order.paymentMethod || 'cash';
            const existing = paymentStats.get(method) || { method: method.toUpperCase(), count: 0, amount: 0 };
            existing.count += 1;
            existing.amount += order.total;
            paymentStats.set(method, existing);
        });

    return Array.from(paymentStats.values());
}

// Get sales by date for charting
export function getSalesByDate(orders: Order[], dateFilter: DateFilter): { date: string; revenue: number; orders: number }[] {
    const salesByDate = new Map<string, { revenue: number; orders: number }>();

    orders
        .filter(order => order.status === 'completed')
        .forEach(order => {
            const orderDate = order.completedAt ? new Date(order.completedAt) : new Date(order.createdAt);
            const dateKey = format(orderDate, 'MMM dd');

            const existing = salesByDate.get(dateKey) || { revenue: 0, orders: 0 };
            existing.revenue += order.total;
            existing.orders += 1;
            salesByDate.set(dateKey, existing);
        });

    return Array.from(salesByDate.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

// Calculate all analytics data
export function calculateAnalytics(
    orders: Order[],
    menuItems: MenuItem[],
    categories: Category[],
    dateFilter: DateFilter
): AnalyticsData {
    const filteredOrders = filterOrdersByDateRange(orders, dateFilter);
    const paidOrders = filteredOrders.filter(order => order.paymentStatus === 'paid');

    const revenue = calculateRevenue(filteredOrders);
    const profit = calculateProfit(filteredOrders, menuItems);
    const orderCount = paidOrders.length;
    const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0;

    return {
        revenue,
        orders: orderCount,
        profit,
        averageOrderValue,
        topItems: getTopSellingItems(filteredOrders, 10),
        categoryBreakdown: getCategoryPerformance(filteredOrders, categories, menuItems),
        paymentMethods: getPaymentMethodBreakdown(filteredOrders),
        salesByDate: getSalesByDate(filteredOrders, dateFilter)
    };
}
