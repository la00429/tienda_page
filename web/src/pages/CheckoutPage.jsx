import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useCart } from '@/hooks/useCart.jsx';
import { formatCurrency } from '@/api/EcommerceApi.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: ''
    });

    const total = getCartTotal();
    const WHATSAPP_NUMBER = '573144205785';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.city) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        setIsProcessing(true);

        try {
            // Construir el mensaje de WhatsApp
            let message = `¡Hola! Me gustaría realizar el siguiente pedido:%0A%0A`;
            message += `*DATOS DEL CLIENTE*%0A`;
            message += `- Nombre: ${formData.name}%0A`;
            message += `- Dirección: ${formData.address}%0A`;
            message += `- Ciudad: ${formData.city}%0A%0A`;
            
            message += `*PRODUCTOS*%0A`;
            cartItems.forEach(item => {
                message += `- ${item.quantity}x ${item.product.name} (Talla: ${item.variant.size}) - ${formatCurrency(item.product.price * item.quantity)}%0A`;
            });
            
            message += `%0A*TOTAL A PAGAR:* ${formatCurrency(total)}%0A%0A`;
            message += `Quedo atento(a) para confirmar los datos de pago y envío. ¡Gracias!`;

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
            
            clearCart();
            window.open(whatsappUrl, '_blank');
            navigate('/');
            
        } catch (error) {
            toast.error('Error al procesar el pedido. Por favor intenta de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <>
            <Helmet>
                <title>Checkout por WhatsApp - ProSport</title>
                <meta name="description" content="Completa tu pedido por WhatsApp en ProSport" />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Finalizar pedido</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Información de envío</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Nombre completo *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Tu nombre"
                                                required
                                                className="text-foreground"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="address">Dirección de envío *</Label>
                                            <Input
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                placeholder="Calle y número"
                                                required
                                                className="text-foreground"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="city">Ciudad *</Label>
                                            <Input
                                                id="city"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                placeholder="Ej. Bogotá"
                                                required
                                                className="text-foreground"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-1">
                                <Card className="sticky top-20 shadow-lg border-primary/20">
                                    <CardHeader>
                                        <CardTitle>Resumen del pedido</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3 pb-4 border-b">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        {item.product.name} ({item.variant.size}) x{item.quantity}
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatCurrency(item.product.price * item.quantity)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-2 pb-4 border-b">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Envío</span>
                                                <span className="font-medium">A coordinar</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 mb-4">
                                            <span className="text-lg font-semibold">Total</span>
                                            <span className="text-2xl font-bold text-primary">
                                                {formatCurrency(total)}
                                            </span>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-base bg-[#25D366] hover:bg-[#128C7E] text-white"
                                            disabled={isProcessing}
                                        >
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            {isProcessing ? 'Procesando...' : 'Pedir por WhatsApp'}
                                        </Button>
                                        <p className="text-xs text-center text-muted-foreground mt-4">
                                            Serás redirigido a WhatsApp para confirmar tu pedido y método de pago.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default CheckoutPage;
