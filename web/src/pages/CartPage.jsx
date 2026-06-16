import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useCart } from '@/hooks/useCart.jsx';
import { formatCurrency } from '@/api/EcommerceApi.js';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

    const subtotal = getCartTotal();
    const total = subtotal;

    const handleUpdateQuantity = (item, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(item.id);
            return;
        }
        updateQuantity(item.id, newQuantity);
    };

    const handleRemoveItem = (item) => {
        removeFromCart(item.id);
        toast.success('Producto eliminado del carrito');
    };

    if (cartItems.length === 0) {
        return (
            <>
                <Helmet>
                    <title>Carrito de compras - ProSport</title>
                    <meta name="description" content="Tu carrito de compras en ProSport" />
                </Helmet>

                <Header />

                <main className="min-h-screen bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                Parece que aún no has añadido productos a tu carrito. Explora nuestro catálogo y encuentra lo que necesitas.
                            </p>
                            <Link to="/products">
                                <Button size="lg" className="group">
                                    Ver productos
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`Carrito (${cartItems.length}) - ProSport`}</title>
                <meta name="description" content="Revisa y completa tu compra en ProSport" />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Carrito de compras</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                                                {item.product.images?.[0] ? (
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                                                        {item.variant?.size && (
                                                            <p className="text-sm text-muted-foreground">Talla: {item.variant.size}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveItem(item)}
                                                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors duration-200"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <p className="text-xl font-bold">
                                                        {formatCurrency(item.product.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="sticky top-20 shadow-lg">
                                <CardContent className="p-6 space-y-4">
                                    <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

                                    <div className="space-y-3 pb-4 border-b">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Envío</span>
                                            <span className="font-medium">A coordinar por WhatsApp</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-lg font-semibold">Total</span>
                                        <span className="text-2xl font-bold text-primary">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>

                                    <Link to="/checkout" className="block">
                                        <Button className="w-full h-12 text-base group" size="lg">
                                            Finalizar pedido
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                        </Button>
                                    </Link>

                                    <Link to="/products" className="block">
                                        <Button variant="outline" className="w-full">
                                            Seguir comprando
                                        </Button>
                                    </Link>

                                    <div className="pt-4 border-t">
                                        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                                            <p className="font-medium">Pago por WhatsApp 💬</p>
                                            <p className="text-muted-foreground">Coordinaremos tu pago y envío directamente contigo</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default CartPage;
