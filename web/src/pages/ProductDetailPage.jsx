import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getProduct, formatCurrency } from '@/api/EcommerceApi.js';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { ShoppingCart, Minus, Plus, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await getProduct(id);
            if (response.success && response.data) {
                setProduct(response.data);
                if (response.data.variants && response.data.variants.length > 0) {
                    setSelectedVariant(response.data.variants[0]);
                }
            }
        } catch (error) {
            toast.error('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!selectedVariant) {
            toast.error('Por favor selecciona una talla');
            return;
        }

        if (quantity > selectedVariant.stock) {
            toast.error('Cantidad no disponible en stock');
            return;
        }

        addToCart(product, selectedVariant, quantity, selectedVariant.stock);
        toast.success('Producto añadido al carrito');
    };

    const incrementQuantity = () => {
        if (selectedVariant && quantity < selectedVariant.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <Skeleton className="w-full h-96 rounded-2xl mb-4" />
                            <div className="grid grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-24 rounded-lg" />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                    <Link to="/products">
                        <Button>Volver al catálogo</Button>
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    const images = product.images || [];
    const variants = product.variants || [];

    return (
        <>
            <Helmet>
                <title>{`${product.name} - ProSport`}</title>
                <meta name="description" content={product.description || `Compra ${product.name} en ProSport. Ropa deportiva de alta calidad.`} />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors duration-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al catálogo
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="sticky top-20">
                                <Card className="overflow-hidden mb-4 shadow-lg">
                                    <div className="relative h-96 md:h-[500px] bg-muted">
                                        {images.length > 0 ? (
                                            <img
                                                src={images[selectedImage]}
                                                alt={`${product.name} - imagen ${selectedImage + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingCart className="w-24 h-24 text-muted-foreground/30" />
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === index
                                                        ? 'border-primary shadow-md'
                                                        : 'border-transparent hover:border-muted-foreground/30'
                                                    }`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${product.name} miniatura ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                                <p className="text-3xl font-bold text-primary">
                                    {formatCurrency(product.price, { code: 'EUR', symbol: '€' })}
                                </p>
                            </div>

                            {product.description && (
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {variants.length > 0 && (
                                <div>
                                    <Label className="mb-2 block font-semibold">Talla</Label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => {
                                                    setSelectedVariant(variant);
                                                    setQuantity(1);
                                                }}
                                                disabled={variant.stock === 0}
                                                className={`relative h-12 rounded-lg border-2 font-medium transition-all duration-200 ${selectedVariant?.id === variant.id
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : variant.stock === 0
                                                            ? 'border-muted bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                                            : 'border-border hover:border-primary'
                                                    }`}
                                            >
                                                {variant.size}
                                                {selectedVariant?.id === variant.id && (
                                                    <Check className="absolute top-1 right-1 w-3 h-3" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedVariant && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {selectedVariant.stock > 0
                                                ? `${selectedVariant.stock} unidades disponibles`
                                                : 'Sin stock'}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div>
                                <Label className="mb-2 block font-semibold">Cantidad</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="rounded-r-none"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={incrementQuantity}
                                            disabled={!selectedVariant || quantity >= selectedVariant.stock}
                                            className="rounded-l-none"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={!selectedVariant || selectedVariant.stock === 0}
                                    className="w-full h-12 text-base group"
                                    size="lg"
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                    Añadir al carrito
                                </Button>
                                <Link to="/products" className="block">
                                    <Button variant="outline" className="w-full h-12 text-base">
                                        Seguir comprando
                                    </Button>
                                </Link>
                            </div>

                            <Card className="bg-muted/50">
                                <CardContent className="p-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-primary" />
                                        <span>Envío gratis en pedidos superiores a €50</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-primary" />
                                        <span>Devoluciones gratuitas en 30 días</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-primary" />
                                        <span>Garantía de calidad ProSport</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default ProductDetailPage;
