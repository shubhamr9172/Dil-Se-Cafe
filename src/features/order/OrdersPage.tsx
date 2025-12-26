import { useStore } from '../../store';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { format } from 'date-fns';

export default function OrdersPage() {
    const { orders } = useStore();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Order History</h2>

            <div className="grid gap-4">
                {orders.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-lg border">
                        No orders placed yet.
                    </div>
                ) : (
                    orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="bg-gray-50 py-3 border-b">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold">#{order.id.split('-')[1]}</span>
                                        <span className="text-sm text-gray-500">{format(new Date(order.createdAt), 'PP p')}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="font-bold">₹{order.total.toFixed(2)}</div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-1">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-700">{item.quantity} x {item.name}</span>
                                            <span className="text-gray-500">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-2 border-t flex justify-between text-sm">
                                    <span className="text-gray-500">Payment: {(order.paymentMethod || 'cash').toUpperCase()}</span>
                                    <span className="text-gray-500">Table: {order.tableNo}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
