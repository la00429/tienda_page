import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getProducts, formatCurrency } from '@/api/EcommerceApi.js';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getProducts({ limit: 100 });
            if (response.success && response.data) {
                setProducts(response.data);
            }
        } catch (error) {
            toast.error('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (productId) => {
        toast.success('Producto eliminado correctamente');
        setProducts(products.filter(p => p.id !== productId));
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Helmet>
                <title>Gestión de productos - Admin ProSport</title>
                <meta name="description" content="Administra el catálogo de productos de ProSport" />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Gestión de productos</h1>
                            <p className="text-muted-foreground">Administra tu catálogo de productos</p>
                        </div>
                        <Link to="/admin/products/new" className="mt-4 md:mt-0">
                            <Button className="group">
                                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                Nuevo producto
                            </Button>
                        </Link>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar productos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 text-foreground"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Productos ({filteredProducts.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                                            <Skeleton className="w-16 h-16 rounded-lg" />
                                            <div className="flex-grow space-y-2">
                                                <Skeleton className="h-4 w-1/3" />
                                                <Skeleton className="h-4 w-1/4" />
                                            </div>
                                            <Skeleton className="h-10 w-24" />
                                        </div>
                                    ))}
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground mb-4">No se encontraron productos</p>
                                    <Link to="/admin/products/new">
                                        <Button>Crear primer producto</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-semibold text-sm">Producto</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm">Precio</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm">Stock</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm">Categoría</th>
                                                <th className="text-right py-3 px-4 font-semibold text-sm">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map((product) => (
                                                <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors duration-200">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                                                {product.images?.[0] ? (
                                                                    <img
                                                                        src={product.images[0]}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <Package className="w-6 h-6 text-muted-foreground/30" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="font-medium">{product.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 font-semibold">
                                                        {formatCurrency(product.price, { code: 'EUR', symbol: '€' })}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0}
                                                    </td>
                                                    <td className="py-3 px-4 text-muted-foreground capitalize">
                                                        {product.category || 'Sin categoría'}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link to={`/admin/products/${product.id}`}>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="w-4 h-4 mr-2" />
                                                                    Editar
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDelete(product.id)}
                                                                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default AdminProductsPage;
