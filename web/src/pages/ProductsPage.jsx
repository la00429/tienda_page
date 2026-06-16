import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getProducts, formatCurrency } from '@/api/EcommerceApi.js';
import { getCategories } from '@/api/CategoryApi.js';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { ShoppingCart, Search } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [selectedSize, setSelectedSize] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [sortBy, setSortBy] = useState('newest');
    const [categories, setCategories] = useState(['all']);
    const { addToCart } = useCart();

    const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            if (response.success) {
                setCategories(['all', ...response.data]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProducts({ limit: 50 });
            if (response.success && response.data) {
                setProducts(response.data);
            } else {
                setError('No se pudieron cargar los productos.');
                toast.error('Error al cargar los datos');
            }
        } catch (error) {
            setError(error.message || 'Error de conexión');
            toast.error('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = searchQuery === '' ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' ||
            (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());

        const matchesSize = selectedSize === 'all' ||
            (product.variants && product.variants.some(v => v.size === selectedSize));

        const price = product.price;
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesSize && matchesPrice;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    const handleAddToCart = (product) => {
        const defaultVariant = product.variants?.[0] || { size: 'M', stock: 10 };
        addToCart(product, defaultVariant, 1, defaultVariant.stock);
        toast.success('Producto añadido al carrito');
    };

    return (
        <>
            <Helmet>
                <title>Catálogo de productos - ProSport</title>
                <meta name="description" content="Explora nuestro catálogo completo de ropa deportiva. Camisetas, pantalones, accesorios y calzado de alta calidad." />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Catálogo de productos</h1>
                        <p className="text-muted-foreground">Encuentra el equipamiento perfecto para tu entrenamiento</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <aside className="lg:col-span-1">
                            <Card className="sticky top-20">
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <Label htmlFor="search" className="mb-2 block">Buscar</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="search"
                                                type="search"
                                                placeholder="Buscar productos..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 text-foreground"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-2 block">Categoría</Label>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(cat => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat === 'all' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="mb-2 block">Talla</Label>
                                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todas</SelectItem>
                                                {sizes.slice(1).map(size => (
                                                    <SelectItem key={size} value={size}>{size}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="mb-3 block">Rango de precio: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}</Label>
                                        <Slider
                                            min={0}
                                            max={50000}
                                            step={100}
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                            className="mb-2"
                                        />
                                    </div>

                                    <div>
                                        <Label className="mb-2 block">Ordenar por</Label>
                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="newest">Más recientes</SelectItem>
                                                <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                                                <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                                                <SelectItem value="name">Nombre A-Z</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <Card key={i}>
                                            <Skeleton className="h-64 w-full rounded-t-xl" />
                                            <CardContent className="p-4 space-y-2">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                                <Skeleton className="h-10 w-full" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-center py-20 bg-destructive/10 rounded-xl border border-destructive/20">
                                    <h3 className="text-xl font-semibold mb-2 text-destructive">Oops, algo salió mal</h3>
                                    <p className="text-muted-foreground mb-6">{error}</p>
                                    <Button onClick={fetchProducts} variant="outline">
                                        Intentar nuevamente
                                    </Button>
                                </div>
                            ) : sortedProducts.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                                    <p className="text-muted-foreground mb-6">Intenta ajustar los filtros de búsqueda</p>
                                    <Button onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('all');
                                        setSelectedSize('all');
                                        setPriceRange([0, 200]);
                                    }}>
                                        Limpiar filtros
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6 text-sm text-muted-foreground">
                                        Mostrando {sortedProducts.length} {sortedProducts.length === 1 ? 'producto' : 'productos'}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {sortedProducts.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                                    <Link to={`/product/${product.id}`}>
                                                        <div className="relative h-64 overflow-hidden bg-muted">
                                                            {product.images?.[0] ? (
                                                                <img
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <ShoppingCart className="w-16 h-16 text-muted-foreground/30" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Link>
                                                    <CardContent className="p-4 flex flex-col flex-grow">
                                                        <Link to={`/product/${product.id}`}>
                                                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors duration-200">
                                                                {product.name}
                                                            </h3>
                                                        </Link>
                                                        {product.description && (
                                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                        <div className="mt-auto">
                                                            <p className="text-xl font-bold mb-3">
                                                                {formatCurrency(product.price)}
                                                            </p>
                                                            <Button
                                                                onClick={() => handleAddToCart(product)}
                                                                className="w-full group/btn"
                                                                size="sm"
                                                            >
                                                                <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                                                                Añadir al carrito
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default ProductsPage;
