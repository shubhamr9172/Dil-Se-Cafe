import { useState, useEffect } from 'react';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
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
    const [cartOpen, setCartOpen] = useState(false);

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
    const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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
        const now = new Date();
        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            tableNo: 'Walk-in',
            items: cart,
            subtotal: cartTotal,
            tax: tax,
            total: finalTotal,
            status: 'completed', // Set as completed since payment is done
            paymentStatus: 'paid',
            paymentMethod: method,
            createdAt: now,
            completedAt: now.toISOString() // Add completion timestamp for analytics
        };

        addOrder(newOrder);
        setCart([]);
        setIsCheckoutOpen(false);
        setCartOpen(false);
        alert(`Order Placed Successfully via ${method.toUpperCase()}!`);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] gap-4">
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 overflow-y-auto pb-4">
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
                                        <CardContent className="p-3 md:p-4">
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

                {/* Desktop Cart Area */}
                <div className="hidden md:flex w-96 flex-col bg-white rounded-lg shadow-sm border border-gray-200 h-full">
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
            </div>

            {/* Mobile Floating Cart Button */}
            {cart.length > 0 && (
                <button
                    onClick={() => setCartOpen(true)}
                    className="md:hidden fixed bottom-20 right-4 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-colors z-20"
                    aria-label="Open cart"
                >
                    <ShoppingCart className="h-6 w-6" />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            )}

            {/* Mobile Cart Drawer */}
            {cartOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setCartOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col">
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2 font-semibold">
                                <ShoppingCart className="h-5 w-5" />
                                Current Order ({cartItemCount} items)
                            </div>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex-1">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-gray-500">₹{item.price} x {item.quantity}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, -1)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, 1)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
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
                                className="w-full mt-2"
                                size="lg"
                                onClick={() => {
                                    setCartOpen(false);
                                    setIsCheckoutOpen(true);
                                }}
                            >
                                Place Order (₹{finalTotal.toFixed(2)})
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {isCheckoutOpen && (
                <CheckoutModal
                    totalAmount={finalTotal}
                    onClose={() => setIsCheckoutOpen(false)}
                    onConfirm={handleCheckout}
                />
            )}
        </>
    );
}
