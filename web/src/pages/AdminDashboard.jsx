import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { DollarSign, Package, ShoppingCart, TrendingUp, ArrowRight, LogOut } from 'lucide-react';
import { formatCurrency } from '@/api/EcommerceApi.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AdminDashboard = () => {
    const { logout } = useAuth();

    const stats = [
        {
            title: 'Ventas totales',
            value: formatCurrency(4789200),
            icon: DollarSign,
            trend: '+12.3%',
            color: 'text-green-600'
        },
        {
            title: 'Productos vendidos',
            value: '2,847',
            icon: Package,
            trend: '+8.7%',
            color: 'text-blue-600'
        },
        {
            title: 'Pedidos recientes',
            value: '143',
            icon: ShoppingCart,
            trend: '+5.2%',
            color: 'text-purple-600'
        },
        {
            title: 'Tasa de conversión',
            value: '3.8%',
            icon: TrendingUp,
            trend: '+1.4%',
            color: 'text-orange-600'
        }
    ];

    const recentOrders = [
        { id: 'ORD-2847', customer: 'Carlos Mendez', date: '2026-06-08', total: 12450, status: 'pending' },
        { id: 'ORD-2846', customer: 'Sofia Ramirez', date: '2026-06-08', total: 8900, status: 'shipped' },
        { id: 'ORD-2845', customer: 'Diego Torres', date: '2026-06-07', total: 15600, status: 'delivered' },
        { id: 'ORD-2844', customer: 'Ana Martinez', date: '2026-06-07', total: 6750, status: 'pending' },
        { id: 'ORD-2843', customer: 'Luis Garcia', date: '2026-06-06', total: 9320, status: 'shipped' }
    ];

    const getStatusBadge = (status) => {
        const variants = {
            pending: { label: 'Pendiente', className: 'bg-yellow-500/10 text-yellow-700' },
            shipped: { label: 'Enviado', className: 'bg-blue-500/10 text-blue-700' },
            delivered: { label: 'Entregado', className: 'bg-green-500/10 text-green-700' }
        };
        const variant = variants[status] || variants.pending;
        return <Badge className={variant.className}>{variant.label}</Badge>;
    };

    return (
        <>
            <Helmet>
                <title>Panel de administración - ProSport</title>
                <meta name="description" content="Panel de control administrativo de ProSport" />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel de administración</h1>
                            <p className="text-muted-foreground">Gestiona tu tienda y pedidos</p>
                        </div>
                        <Button variant="outline" onClick={logout} className="mt-4 md:mt-0">
                            <LogOut className="w-4 h-4 mr-2" />
                            Cerrar sesión
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${stat.color}`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm font-medium text-green-600">{stat.trend}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Link to="/admin/products" className="block">
                            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                <CardContent className="p-6">
                                    <Package className="w-12 h-12 text-primary mb-4" />
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                                        Gestión de productos
                                    </h3>
                                    <p className="text-muted-foreground mb-4">Administra tu catálogo de productos</p>
                                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                                        Ir a productos
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link to="/admin/orders" className="block">
                            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                <CardContent className="p-6">
                                    <ShoppingCart className="w-12 h-12 text-primary mb-4" />
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                                        Gestión de pedidos
                                    </h3>
                                    <p className="text-muted-foreground mb-4">Administra y procesa pedidos</p>
                                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                                        Ir a pedidos
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link to="/admin/inventory" className="block">
                            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                <CardContent className="p-6">
                                    <TrendingUp className="w-12 h-12 text-primary mb-4" />
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                                        Control de inventario
                                    </h3>
                                    <p className="text-muted-foreground mb-4">Gestiona stock y alertas</p>
                                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                                        Ir a inventario
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link to="/admin/categories" className="block">
                            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                <CardContent className="p-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary mb-4"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                                        Gestión de categorías
                                    </h3>
                                    <p className="text-muted-foreground mb-4">Administra categorías de productos</p>
                                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                                        Ir a categorías
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Pedidos recientes</CardTitle>
                                <Link to="/admin/orders">
                                    <Button variant="outline" size="sm">
                                        Ver todos
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors duration-200">
                                                <td className="py-3 px-4 font-medium">{order.id}</td>
                                                <td className="py-3 px-4">{order.customer}</td>
                                                <td className="py-3 px-4 text-muted-foreground">
                                                    {new Date(order.date).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="py-3 px-4 font-semibold">
                                                    {formatCurrency(order.total)}
                                                </td>
                                                <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default AdminDashboard;
