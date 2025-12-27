import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import type { MenuItem } from '../../types';
import { useStore } from '../../store';

export default function MenuManagement() {
    const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory, updateCategory, deleteCategory } = useStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    // Form State
    const [formName, setFormName] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formType, setFormType] = useState<'veg' | 'non-veg'>('veg');
    const [formCategory, setFormCategory] = useState('');

    // Category Edit State
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState('');

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
        setFormCategory(selectedCategory || (categories.length > 0 ? categories[0].id : ''));
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: MenuItem) => {
        setEditingItem(item);
        setFormName(item.name);
        setFormPrice(item.price.toString());
        setFormType(item.type === 'egg' ? 'veg' : item.type);
        setFormCategory(item.categoryId);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formPrice) return;

        // Validate that a category exists before adding item
        if (categories.length === 0) {
            alert('Please create a category first before adding items!');
            return;
        }

        if (!formCategory) {
            alert('Please select a category!');
            return;
        }

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
                categoryId: formCategory,
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
        if (name && name.trim()) {
            addCategory({
                id: Date.now().toString(),
                name: name.trim(),
                slug: name.trim().toLowerCase().replace(/\s+/g, '-')
            });
        }
    };

    const handleEditCategory = (categoryId: string, currentName: string) => {
        setEditingCategory(categoryId);
        setCategoryName(currentName);
    };

    const handleSaveCategory = () => {
        if (editingCategory && categoryName.trim()) {
            updateCategory(editingCategory, {
                name: categoryName.trim(),
                slug: categoryName.trim().toLowerCase().replace(/\s+/g, '-')
            });
            setEditingCategory(null);
            setCategoryName('');
        }
    };

    const handleDeleteCategory = (categoryId: string, categoryName: string) => {
        if (confirm(`Are you sure you want to delete the category "${categoryName}"? All items in this category will remain but won't be visible until assigned to another category.`)) {
            deleteCategory(categoryId);
            // If deleted category was selected, select first remaining category
            if (selectedCategory === categoryId && categories.length > 1) {
                const remainingCategory = categories.find(c => c.id !== categoryId);
                if (remainingCategory) {
                    setSelectedCategory(remainingCategory.id);
                }
            }
        }
    };

    return (
        <div className="space-y-4 md:space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Menu Management</h2>
                <Button onClick={handleOpenAddModal} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            {/* Categories */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                    <div key={cat.id} className="group flex items-center gap-1">
                        {editingCategory === cat.id ? (
                            <div className="flex items-center gap-1 bg-white border border-primary rounded-md px-2 py-1">
                                <Input
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="h-8 w-32 text-sm"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveCategory();
                                        if (e.key === 'Escape') setEditingCategory(null);
                                    }}
                                />
                                <Button size="sm" onClick={handleSaveCategory} className="h-8">
                                    Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)} className="h-8">
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant={selectedCategory === cat.id ? 'primary' : 'outline'}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className="whitespace-nowrap"
                                >
                                    {cat.name}
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditCategory(cat.id, cat.name);
                                    }}
                                >
                                    <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCategory(cat.id, cat.name);
                                    }}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </>
                        )}
                    </div>
                ))}

                {/* Add Category Button */}
                <Button
                    variant="outline"
                    onClick={handleAddCategory}
                    className="whitespace-nowrap border-dashed"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Category
                </Button>
            </div>

            {/* Empty State - No Categories */}
            {categories.length === 0 && (
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-lg font-medium mb-2">No Categories Yet</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Start by creating a category (e.g., "Beverages", "Snacks", "Main Course")
                        </p>
                        <Button onClick={handleAddCategory} variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> Create Your First Category
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Empty State - No Items in Selected Category */}
            {categories.length > 0 && filteredItems.length === 0 && (
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-lg font-medium mb-2">No Items in This Category</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Click "Add Item" to add menu items to this category
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Items Grid */}
            {filteredItems.length > 0 && (
                <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
            )}

            {/* Add/Edit Item Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-10 border-b">
                            <CardTitle className="text-lg md:text-xl">{editingItem ? 'Edit Item' : 'Add New Item'}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Item Name</label>
                                    <Input
                                        required
                                        placeholder="e.g., Grilled Sandwich"
                                        value={formName}
                                        onChange={e => setFormName(e.target.value)}
                                        className="h-11"
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
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <select
                                        required
                                        className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={formCategory}
                                        onChange={e => setFormCategory(e.target.value)}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
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

                                <div className="pt-4 flex flex-col sm:flex-row justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="h-11">Cancel</Button>
                                    <Button type="submit" className="h-11">{editingItem ? 'Update Item' : 'Save Item'}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
