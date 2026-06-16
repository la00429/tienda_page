import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Package, User, LogOut, Eye } from 'lucide-react';
import { formatCurrency } from '@/api/EcommerceApi.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AccountPage = () => {
    const { user, logout } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const mockOrders = [
        {
            id: 'ORD-2847',
            date: '2026-06-05',
            status: 'delivered',
            total: 12450,
            items: [
                { name: 'Pro Runner Tee', quantity: 2, price: 3499 },
                { name: 'Elite Training Shorts', quantity: 1, price: 5452 }
            ]
        },
        {
            id: 'ORD-2791',
            date: '2026-05-28',
            status: 'shipped',
            total: 8900,
            items: [
                { name: 'Performance Leggings', quantity: 1, price: 8900 }
            ]
        },
        {
            id: 'ORD-2654',
            date: '2026-05-15',
            status: 'pending',
            total: 15600,
            items: [
                { name: 'Training Jacket', quantity: 1, price: 12400 },
                { name: 'Sport Cap', quantity: 2, price: 1600 }
            ]
        }
    ];

    const getStatusBadge = (status) => {
        const variants = {
            pending: { label: 'Pendiente', className: 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20' },
            shipped: { label: 'Enviado', className: 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20' },
            delivered: { label: 'Entregado', className: 'bg-green-500/10 text-green-700 hover:bg-green-500/20' }
        };
        const variant = variants[status] || variants.pending;
        return <Badge className={variant.className}>{variant.label}</Badge>;
    };

    return (
        <>
            <Helmet>
                <title>Mi cuenta - ProSport</title>
                <meta name="description" content="Gestiona tu cuenta, pedidos y preferencias en ProSport" />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mi cuenta</h1>
                            <p className="text-muted-foreground">Gestiona tus pedidos y preferencias</p>
                        </div>
                        <Button variant="outline" onClick={logout} className="mt-4 md:mt-0">
                            <LogOut className="w-4 h-4 mr-2" />
                            Cerrar sesión
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Información personal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                                        <p className="font-medium">{user?.name || 'Usuario'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                                        <p className="font-medium">{user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Dirección</p>
                                        <p className="font-medium">Calle Principal 123</p>
                                        <p className="text-sm text-muted-foreground">28001 Madrid, España</p>
                                    </div>
                                    <Button variant="outline" className="w-full mt-4">
                                        Editar información
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-2">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Historial de pedidos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {mockOrders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                            <p className="text-muted-foreground">No tienes pedidos aún</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {mockOrders.map((order) => (
                                                <Card key={order.id} className="border-2">
                                                    <CardContent className="p-4">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                            <div className="flex-grow">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <p className="font-semibold">Pedido {order.id}</p>
                                                                    {getStatusBadge(order.status)}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground mb-1">
                                                                    Fecha: {new Date(order.date).toLocaleDateString('es-ES', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <p className="text-xl font-bold">
                                                                    {formatCurrency(order.total, { code: 'EUR', symbol: '€' })}
                                                                </p>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setSelectedOrder(order)}
                                                                >
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    Ver detalles
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalles del pedido {selectedOrder?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground mb-1">Fecha del pedido</p>
                                    <p className="font-medium">
                                        {new Date(selectedOrder.date).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-1">Estado</p>
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold mb-3">Productos</p>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold">
                                                {formatCurrency(item.price * item.quantity, { code: 'EUR', symbol: '€' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold">Total</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatCurrency(selectedOrder.total, { code: 'EUR', symbol: '€' })}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-4">
                                <p className="font-medium mb-2">Dirección de envío</p>
                                <p className="text-sm">{user?.name}</p>
                                <p className="text-sm text-muted-foreground">Calle Principal 123</p>
                                <p className="text-sm text-muted-foreground">28001 Madrid, España</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </>
    );
};

export default AccountPage;
