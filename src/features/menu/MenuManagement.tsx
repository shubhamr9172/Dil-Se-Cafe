import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import type { MenuItem } from '../../types';
import { useStore } from '../../store';

export default function MenuManagement() {
    const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory } = useStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    // Form State
    const [formName, setFormName] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formType, setFormType] = useState<'veg' | 'non-veg'>('veg');

    // Set default category when categories load
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0].id);
        }
    }, [categories, selectedCategory]);

    // Filter items by category
    const filteredItems = menuItems.filter(item => item.categoryId === selectedCategory);

    const handleOpenAddModal = () => {
        setEditingItem(null);
        setFormName('');
        setFormPrice('');
        setFormType('veg');
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: MenuItem) => {
        setEditingItem(item);
        setFormName(item.name);
        setFormPrice(item.price.toString());
        setFormType(item.type === 'egg' ? 'veg' : item.type);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formPrice) return;

        if (editingItem) {
            // Update existing item
            updateMenuItem(editingItem.id, {
                name: formName,
                price: Number(formPrice),
                type: formType
            });
        } else {
            // Add new item
            const newItem: MenuItem = {
                id: Date.now().toString(),
                name: formName,
                price: Number(formPrice),
                categoryId: selectedCategory,
                isAvailable: true,
                type: formType
            };
            addMenuItem(newItem);
        }

        // Reset and close
        setFormName('');
        setFormPrice('');
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleAddCategory = () => {
        const name = prompt("Enter new category name:");
        if (name) {
            addCategory({
                id: Date.now().toString(),
                name,
                slug: name.toLowerCase().replace(/\s+/g, '-')
            });
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Menu Management</h2>
                <Button onClick={handleOpenAddModal}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            {/* Categories */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                    <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? 'primary' : 'outline'}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="whitespace-nowrap"
                    >
                        {cat.name}
                    </Button>
                ))}
                <Button variant="ghost" className="whitespace-nowrap" onClick={handleAddCategory}>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            {/* Items Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                    <Card key={item.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.name}
                            </CardTitle>
                            <div className={`h-3 w-3 rounded-full ${item.type === 'veg' ? 'bg-green-500' : item.type === 'non-veg' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{item.price}</div>
                            <p className="text-xs text-muted-foreground">
                                {item.description || 'No description'}
                            </p>
                            <div className="mt-4 flex justify-end space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(item)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteMenuItem(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add/Edit Item Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Item Name</label>
                                    <Input
                                        required
                                        placeholder="e.g., Grilled Sandwich"
                                        value={formName}
                                        onChange={e => setFormName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Price (₹)</label>
                                    <Input
                                        required
                                        type="number"
                                        placeholder="150"
                                        value={formPrice}
                                        onChange={e => setFormPrice(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="type"
                                                checked={formType === 'veg'}
                                                onChange={() => setFormType('veg')}
                                            /> Veg
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="type"
                                                checked={formType === 'non-veg'}
                                                onChange={() => setFormType('non-veg')}
                                            /> Non-Veg
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit">{editingItem ? 'Update Item' : 'Save Item'}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
