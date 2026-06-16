import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getCategories } from '@/api/CategoryApi.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CreateProductPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        images: [''],
        variants: [{ size: 'M', stock: 0 }]
    });

    const [categories, setCategories] = useState([]);
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getCategories();
            if (response.success) {
                setCategories(response.data);
                if (response.data.length > 0) {
                    setFormData(prev => ({ ...prev, category: response.data[0] }));
                }
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        if (parseFloat(formData.price) <= 0) {
            toast.error('El precio debe ser mayor a 0');
            return;
        }

        toast.success('Producto creado correctamente');
        navigate('/admin/products');
    };

    const addImage = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
    };

    const updateImage = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [...formData.variants, { size: 'M', stock: 0 }]
        });
    };

    const removeVariant = (index) => {
        const newVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: newVariants.length > 0 ? newVariants : [{ size: 'M', stock: 0 }] });
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = field === 'stock' ? parseInt(value) || 0 : value;
        setFormData({ ...formData, variants: newVariants });
    };

    return (
        <>
            <Helmet>
                <title>Crear producto - Admin ProSport</title>
                <meta name="description" content="Crear nuevo producto en el catálogo de ProSport" />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link to="/admin/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors duration-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a productos
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Crear nuevo producto</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Información básica</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nombre del producto *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej: Pro Runner Tee"
                                        required
                                        className="text-foreground"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Descripción</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe las características del producto..."
                                        rows={4}
                                        className="text-foreground"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Precio (€) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="34.99"
                                            required
                                            className="text-foreground"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Categoría *</Label>
                                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(cat => (
                                                    <SelectItem key={cat} value={cat} className="capitalize">
                                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Imágenes del producto</CardTitle>
                                    <Button type="button" variant="outline" size="sm" onClick={addImage}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Añadir imagen
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={image}
                                            onChange={(e) => updateImage(index, e.target.value)}
                                            placeholder="URL de la imagen"
                                            className="text-foreground"
                                        />
                                        {formData.images.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Variantes y stock</CardTitle>
                                    <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Añadir talla
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {formData.variants.map((variant, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="flex-1">
                                            <Select
                                                value={variant.size}
                                                onValueChange={(value) => updateVariant(index, 'size', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sizes.map(size => (
                                                        <SelectItem key={size} value={size}>{size}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                                                placeholder="Stock"
                                                min="0"
                                                className="text-foreground"
                                            />
                                        </div>
                                        {formData.variants.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeVariant(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1">
                                Crear producto
                            </Button>
                            <Link to="/admin/products" className="flex-1">
                                <Button type="button" variant="outline" className="w-full">
                                    Cancelar
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default CreateProductPage;
