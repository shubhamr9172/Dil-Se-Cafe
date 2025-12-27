import { useEffect, useState } from 'react';
import { Clock, CheckCircle, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store';

export default function KitchenDisplay() {
    const { orders, updateOrderStatus } = useStore();
    const [selectedStatus, setSelectedStatus] = useState<'pending' | 'preparing' | 'ready'>('pending');

    // Auto-refresh simulation (not strictly needed with local state, but good for future polling)
    useEffect(() => {
        const interval = setInterval(() => {
            // In real app, this would be Firestore onSnapshot
            console.log('Refreshing orders...');
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const Columns = [
        { title: 'Pending', status: 'pending', color: 'bg-yellow-100 border-yellow-300' },
        { title: 'Preparing', status: 'preparing', color: 'bg-blue-100 border-blue-300' },
        { title: 'Ready', status: 'ready', color: 'bg-green-100 border-green-300' },
    ] as const;

    return (
        <>
            {/* Mobile Tabs */}
            <div className="md:hidden flex space-x-2 mb-4 overflow-x-auto pb-2">
                {Columns.map(col => (
                    <Button
                        key={col.status}
                        variant={selectedStatus === col.status ? 'primary' : 'outline'}
                        onClick={() => setSelectedStatus(col.status)}
                        className="whitespace-nowrap flex-shrink-0"
                    >
                        {col.status === 'pending' && <Clock className="h-4 w-4 mr-2" />}
                        {col.status === 'preparing' && <ChefHat className="h-4 w-4 mr-2" />}
                        {col.status === 'ready' && <CheckCircle className="h-4 w-4 mr-2" />}
                        {col.title}
                    </Button>
                ))}
            </div>

            {/* Mobile View - Single Column */}
            <div className="md:hidden space-y-4 pb-4">
                {orders.filter(o => o.status === selectedStatus).length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No orders</div>
                ) : (
                    orders.filter(o => o.status === selectedStatus).map(order => (
                        <Card key={order.id} className="bg-white shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex justify-between items-center text-base">
                                    <span>#{order.id.split('-')[1]}</span>
                                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">Table: {order.tableNo}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span>{item.quantity}x {item.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-2">
                                    {order.status === 'pending' && (
                                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')} className="flex-1">Start</Button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')} className="flex-1">Mark Ready</Button>
                                    )}
                                    {order.status === 'ready' && (
                                        <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'completed')} className="flex-1">Serve</Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Desktop View - Three Columns */}
            <div className="hidden md:block h-[calc(100vh-6rem)] overflow-x-auto">
                <div className="flex gap-4 h-full min-w-[1024px]">
                    {Columns.map(col => (
                        <div key={col.status} className={`flex-1 flex flex-col rounded-lg border p-4 ${col.color}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                {col.status === 'pending' && <Clock className="h-5 w-5" />}
                                {col.status === 'preparing' && <ChefHat className="h-5 w-5" />}
                                {col.status === 'ready' && <CheckCircle className="h-5 w-5" />}
                                {col.title}
                            </h2>

                            <div className="space-y-4 overflow-y-auto flex-1">
                                {orders.filter(o => o.status === col.status).map(order => (
                                    <Card key={order.id} className="bg-white shadow-sm">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex justify-between items-center text-base">
                                                <span>#{order.id.split('-')[1]}</span>
                                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">Table: {order.tableNo}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-1 mb-4">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm">
                                                        <span>{item.quantity}x {item.name}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-end gap-2">
                                                {order.status === 'pending' && (
                                                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>Start</Button>
                                                )}
                                                {order.status === 'preparing' && (
                                                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>Mark Ready</Button>
                                                )}
                                                {order.status === 'ready' && (
                                                    <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'completed')}>Serve</Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {orders.filter(o => o.status === col.status).length === 0 && (
                                    <div className="text-center text-gray-400 py-8">No orders</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
