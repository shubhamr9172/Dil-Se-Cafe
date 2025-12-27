import { useState, useMemo } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, TrendingDown } from 'lucide-react';
import { useStore } from '../../store';
import { calculateAnalytics, getDateRange, type DateRange } from './analyticsUtils';

import StatsCard from './components/StatsCard';
import SalesChart from './components/SalesChart';
import DateRangePicker from './components/DateRangePicker';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function AnalyticsPage() {
    const { orders, menuItems, categories } = useStore();
    const [selectedRange, setSelectedRange] = useState<DateRange>('today');

    // Calculate analytics data
    const analyticsData = useMemo(() => {
        const dateFilter = getDateRange(selectedRange);
        return calculateAnalytics(orders, menuItems, categories, dateFilter);
    }, [orders, menuItems, categories, selectedRange]);

    const formatCurrency = (amount: number) => {
        return `₹${amount.toFixed(2)}`;
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
                <DateRangePicker selected={selectedRange} onSelect={setSelectedRange} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(analyticsData.revenue)}
                    icon={DollarSign}
                />
                <StatsCard
                    title="Total Orders"
                    value={analyticsData.orders}
                    icon={ShoppingCart}
                />
                <StatsCard
                    title="Total Profit"
                    value={formatCurrency(analyticsData.profit)}
                    icon={TrendingUp}
                />
                <StatsCard
                    title="Avg Order Value"
                    value={formatCurrency(analyticsData.averageOrderValue)}
                    icon={TrendingDown}
                />
            </div>

            {/* Sales Chart */}
            {analyticsData.salesByDate.length > 0 ? (
                <SalesChart data={analyticsData.salesByDate} />
            ) : (
                <Card>
                    <CardContent className="p-8 text-center text-neutral-500">
                        No sales data available for the selected period
                    </CardContent>
                </Card>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Top Selling Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analyticsData.topItems.length > 0 ? (
                            <div className="space-y-3">
                                {analyticsData.topItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-secondary-900">{item.name}</p>
                                                <p className="text-sm text-neutral-500">{item.quantity} sold</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-primary-600">{formatCurrency(item.revenue)}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-neutral-500 py-8">No items sold yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Category Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {analyticsData.categoryBreakdown.length > 0 ? (
                            <div className="space-y-3">
                                {analyticsData.categoryBreakdown.map((cat, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-secondary-900">{cat.category}</span>
                                            <span className="text-sm text-neutral-500">{cat.count} items</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary-500 rounded-full"
                                                    style={{
                                                        width: `${(cat.revenue / analyticsData.revenue) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="font-semibold text-primary-600 min-w-[80px] text-right">
                                                {formatCurrency(cat.revenue)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-neutral-500 py-8">No category data available</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Payment Methods */}
            {analyticsData.paymentMethods.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {analyticsData.paymentMethods.map((payment, index) => (
                                <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                                    <p className="text-sm text-neutral-500 mb-1">{payment.method}</p>
                                    <p className="text-2xl font-bold text-secondary-900">{formatCurrency(payment.amount)}</p>
                                    <p className="text-sm text-neutral-600 mt-1">{payment.count} transactions</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
