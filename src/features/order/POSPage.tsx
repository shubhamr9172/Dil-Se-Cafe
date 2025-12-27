import { useState, useEffect } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import type { MenuItem, OrderItem, Order } from '../../types';
import CheckoutModal from './CheckoutModal';
import { useStore } from '../../store';

export default function POSPage() {
    const { menuItems, categories, addOrder } = useStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('1');
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        if (categories.length > 0 && !categories.find(c => c.id === selectedCategory)) {
            setSelectedCategory(categories[0].id);
        }
    }, [categories, selectedCategory]);

    // Derived state
    const filteredItems = menuItems.filter(item => item.categoryId === selectedCategory);
    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = cartTotal * 0.05; // 5% GST
    const finalTotal = cartTotal + tax;

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handleCheckout = (method: 'cash' | 'upi') => {
        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            tableNo: 'Walk-in',
            items: cart,
            subtotal: cartTotal,
            tax: tax,
            total: finalTotal,
            status: 'pending',
            paymentStatus: 'paid',
            paymentMethod: method,
            createdAt: new Date()
        };

        addOrder(newOrder);
        setCart([]);
        setIsCheckoutOpen(false);
        alert(`Order Placed Successfully via ${method.toUpperCase()}!`);
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-4">
            {/* Product Area */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Categories */}
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.id ? 'primary' : 'outline'}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="whitespace-nowrap flex-shrink-0"
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <p className="text-lg font-medium mb-2">No menu items found</p>
                        <p className="text-sm mb-4">Get started by adding categories and items.</p>
                        <Link to="/menu">
                            <Button>Go to Menu Management</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-4">
                        {filteredItems.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center h-40 text-gray-500">
                                <p>No items in this category</p>
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <Card
                                    key={item.id}
                                    className="cursor-pointer hover:border-primary transition-colors flex flex-col justify-between"
                                    onClick={() => addToCart(item)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                                            <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1 ${item.type === 'veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        </div>
                                        <div className="text-primary font-bold">₹{item.price}</div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Cart Area */}
            <div className="w-96 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                <div className="p-4 border-b border-gray-200 font-semibold flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" /> Current Order
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">Cart is empty</div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <div className="flex-1">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-gray-500">₹{item.price} x {item.quantity}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-4 text-center">{item.quantity}</span>
                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>GST (5%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                    <Button
                        className="w-full mt-4"
                        size="lg"
                        disabled={cart.length === 0}
                        onClick={() => setIsCheckoutOpen(true)}
                    >
                        Place Order (₹{finalTotal.toFixed(2)})
                    </Button>
                </div>
            </div>

            {isCheckoutOpen && (
                <CheckoutModal
                    totalAmount={finalTotal}
                    onClose={() => setIsCheckoutOpen(false)}
                    onConfirm={handleCheckout}
                />
            )}
        </div>
    );
}
