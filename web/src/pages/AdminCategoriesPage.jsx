import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { getCategories, addCategory, deleteCategory } from '@/api/CategoryApi.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Trash2, Plus, Tags } from 'lucide-react';
import { toast } from 'sonner';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const response = await getCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            toast.error('Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await addCategory(newCategory);
            if (response.success) {
                setCategories(response.data);
                setNewCategory('');
                toast.success('Categoría agregada correctamente');
            } else {
                toast.error(response.message || 'No se pudo agregar la categoría');
            }
        } catch (error) {
            toast.error('Error al agregar categoría');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (category) => {
        if (!window.confirm(`¿Seguro que deseas eliminar la categoría "${category}"?`)) return;

        try {
            const response = await deleteCategory(category);
            if (response.success) {
                setCategories(response.data);
                toast.success('Categoría eliminada');
            }
        } catch (error) {
            toast.error('Error al eliminar categoría');
        }
    };

    return (
        <div className="space-y-6">
            <Helmet>
                <title>Gestionar Categorías | Panel Admin</title>
            </Helmet>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
                    <p className="text-muted-foreground">Crea y administra las categorías de tus productos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Nueva Categoría
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <Input
                                    placeholder="Nombre de la categoría"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    disabled={isSubmitting}
                                    className="text-foreground"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting || !newCategory.trim()}>
                                {isSubmitting ? 'Agregando...' : 'Agregar Categoría'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Tags className="w-5 h-5" /> Categorías Actuales
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-muted-foreground text-center py-8">Cargando categorías...</p>
                        ) : categories.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">No hay categorías registradas.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {categories.map((category, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg hover:border-primary/50 transition-colors">
                                        <span className="font-medium capitalize">{category}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteCategory(category)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminCategoriesPage;
