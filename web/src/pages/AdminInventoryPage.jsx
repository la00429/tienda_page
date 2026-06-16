import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { getProducts } from '@/api/EcommerceApi.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { AlertTriangle, Package, Save } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminInventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stockUpdates, setStockUpdates] = useState({});

    const LOW_STOCK_THRESHOLD = 10;

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

    const handleStockChange = (productId, variantId, newStock) => {
        setStockUpdates({
            ...stockUpdates,
            [`${productId}-${variantId}`]: parseInt(newStock) || 0
        });
    };

    const handleSaveStock = (productId, variantId) => {
        const key = `${productId}-${variantId}`;
        if (stockUpdates[key] !== undefined) {
            setProducts(products.map(product => {
                if (product.id === productId) {
                    return {
                        ...product,
                        variants: product.variants.map(variant =>
                            variant.id === variantId
                                ? { ...variant, stock: stockUpdates[key] }
                                : variant
                        )
                    };
                }
                return product;
            }));

            const newUpdates = { ...stockUpdates };
            delete newUpdates[key];
            setStockUpdates(newUpdates);

            toast.success('Stock actualizado correctamente');
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) {
            return <Badge className="bg-red-500/10 text-red-700">Sin stock</Badge>;
        } else if (stock <= LOW_STOCK_THRESHOLD) {
            return <Badge className="bg-yellow-500/10 text-yellow-700">Stock bajo</Badge>;
        }
        return <Badge className="bg-green-500/10 text-green-700">En stock</Badge>;
    };

    const lowStockProducts = products.filter(product =>
        product.variants?.some(v => v.stock > 0 && v.stock <= LOW_STOCK_THRESHOLD)
    );

    return (
        <>
            <Helmet>
                <title>Control de inventario - Admin ProSport</title>
                <meta name="description" content="Gestiona el inventario y stock de productos de ProSport" />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Control de inventario</h1>
                        <p className="text-muted-foreground">Gestiona el stock de tus productos</p>
                    </div>

                    {lowStockProducts.length > 0 && (
                        <Card className="mb-6 border-yellow-500/20 bg-yellow-500/5">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                                            Alerta de stock bajo
                                        </p>
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            {lowStockProducts.length} {lowStockProducts.length === 1 ? 'producto tiene' : 'productos tienen'} stock bajo (≤{LOW_STOCK_THRESHOLD} unidades)
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Inventario de productos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                                            <Skeleton className="w-12 h-12 rounded-lg" />
                                            <div className="flex-grow space-y-2">
                                                <Skeleton className="h-4 w-1/3" />
                                                <Skeleton className="h-4 w-1/4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground">No hay productos en el inventario</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-semibold text-sm">Producto</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm">Talla</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm">Stock actual</th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm">Estado</th>
                                                <th className="text-right py-3 px-4 font-semibold text-sm">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) =>
                                                product.variants?.map((variant) => {
                                                    const key = `${product.id}-${variant.id}`;
                                                    const currentStock = stockUpdates[key] !== undefined ? stockUpdates[key] : variant.stock;
                                                    const hasChanges = stockUpdates[key] !== undefined;

                                                    return (
                                                        <tr
                                                            key={key}
                                                            className={`border-b hover:bg-muted/30 transition-colors duration-200 ${variant.stock <= LOW_STOCK_THRESHOLD && variant.stock > 0 ? 'bg-yellow-500/5' : ''
                                                                }`}
                                                        >
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                                                        {product.images?.[0] ? (
                                                                            <img
                                                                                src={product.images[0]}
                                                                                alt={product.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <Package className="w-5 h-5 text-muted-foreground/30" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <span className="font-medium">{product.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4 font-medium">{variant.size}</td>
                                                            <td className="py-3 px-4">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    value={currentStock}
                                                                    onChange={(e) => handleStockChange(product.id, variant.id, e.target.value)}
                                                                    className="w-24 text-foreground"
                                                                />
                                                            </td>
                                                            <td className="py-3 px-4">{getStockStatus(currentStock)}</td>
                                                            <td className="py-3 px-4">
                                                                <div className="flex justify-end">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleSaveStock(product.id, variant.id)}
                                                                        disabled={!hasChanges}
                                                                    >
                                                                        <Save className="w-4 h-4 mr-2" />
                                                                        Guardar
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
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

export default AdminInventoryPage;
