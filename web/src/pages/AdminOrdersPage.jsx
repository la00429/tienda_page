import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Search, Eye, Calendar } from 'lucide-react';
import { formatCurrency } from '@/api/EcommerceApi.js';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminOrdersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const mockOrders = [
        {
            id: 'ORD-2847',
            customer: { name: 'Carlos Mendez', email: 'carlos@email.com', address: 'Calle Mayor 45, Madrid' },
            date: '2026-06-08',
            status: 'pending',
            total: 12450,
            items: [
                { name: 'Pro Runner Tee', quantity: 2, price: 3499, size: 'M' },
                { name: 'Elite Training Shorts', quantity: 1, price: 5452, size: 'L' }
            ]
        },
        {
            id: 'ORD-2846',
            customer: { name: 'Sofia Ramirez', email: 'sofia@email.com', address: 'Avenida Libertad 12, Barcelona' },
            date: '2026-06-08',
            status: 'shipped',
            total: 8900,
            items: [
                { name: 'Performance Leggings', quantity: 1, price: 8900, size: 'S' }
            ]
        },
        {
            id: 'ORD-2845',
            customer: { name: 'Diego Torres', email: 'diego@email.com', address: 'Plaza Central 8, Valencia' },
            date: '2026-06-07',
            status: 'delivered',
            total: 15600,
            items: [
                { name: 'Training Jacket', quantity: 1, price: 12400, size: 'XL' },
                { name: 'Sport Cap', quantity: 2, price: 1600, size: 'One Size' }
            ]
        }
    ];

    const [orders, setOrders] = useState(mockOrders);

    const getStatusBadge = (status) => {
        const variants = {
            pending: { label: 'Pendiente', className: 'bg-yellow-500/10 text-yellow-700' },
            shipped: { label: 'Enviado', className: 'bg-blue-500/10 text-blue-700' },
            delivered: { label: 'Entregado', className: 'bg-green-500/10 text-green-700' }
        };
        const variant = variants[status] || variants.pending;
        return <Badge className={variant.className}>{variant.label}</Badge>;
    };

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success('Estado del pedido actualizado');
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchQuery === '' ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Helmet>
                <title>Gestión de pedidos - Admin ProSport</title>
                <meta name="description" content="Administra los pedidos de ProSport" />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Gestión de pedidos</h1>
                        <p className="text-muted-foreground">Administra y procesa los pedidos de clientes</p>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="mb-2 block">Buscar pedido</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="ID de pedido o nombre de cliente..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 text-foreground"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2 block">Filtrar por estado</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="pending">Pendiente</SelectItem>
                                            <SelectItem value="shipped">Enviado</SelectItem>
                                            <SelectItem value="delivered">Entregado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-semibold text-sm">ID Pedido</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm">Cliente</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm">Fecha</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm">Total</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm">Estado</th>
                                            <th className="text-right py-3 px-4 font-semibold text-sm">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors duration-200">
                                                <td className="py-3 px-4 font-medium">{order.id}</td>
                                                <td className="py-3 px-4">{order.customer.name}</td>
                                                <td className="py-3 px-4 text-muted-foreground">
                                                    {new Date(order.date).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="py-3 px-4 font-semibold">
                                                    {formatCurrency(order.total, { code: 'EUR', symbol: '€' })}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Select
                                                        value={order.status}
                                                        onValueChange={(value) => handleStatusChange(order.id, value)}
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pendiente</SelectItem>
                                                            <SelectItem value="shipped">Enviado</SelectItem>
                                                            <SelectItem value="delivered">Entregado</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex justify-end">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedOrder(order)}
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Ver detalles
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
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

                            <div className="bg-muted/50 rounded-lg p-4">
                                <p className="font-semibold mb-2">Información del cliente</p>
                                <p className="text-sm font-medium">{selectedOrder.customer.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                                <p className="text-sm text-muted-foreground mt-2">{selectedOrder.customer.address}</p>
                            </div>

                            <div>
                                <p className="font-semibold mb-3">Productos</p>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Talla: {item.size} | Cantidad: {item.quantity}
                                                </p>
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
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </>
    );
};

export default AdminOrdersPage;
