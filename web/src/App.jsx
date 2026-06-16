import React from 'react';
import { Route, Routes, HashRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { CartProvider } from '@/hooks/useCart.jsx';
import ScrollToTop from '@/components/ScrollTop.jsx';
import AdminRoute from '@/components/AdminRoute.jsx';

import HomePage from '@/pages/HomePage.jsx';
import ProductsPage from '@/pages/ProductsPage.jsx';
import ProductDetailPage from '@/pages/ProductDetailPage.jsx';
import CartPage from '@/pages/CartPage.jsx';
import CheckoutPage from '@/pages/CheckoutPage.jsx';
import SuccessPage from '@/pages/SuccessPage.jsx';
import AdminLoginPage from '@/pages/AdminLoginPage.jsx';
import AdminDashboard from '@/pages/AdminDashboard.jsx';
import AdminProductsPage from '@/pages/AdminProductsPage.jsx';
import CreateProductPage from '@/pages/CreateProductPage.jsx';
import EditProductPage from '@/pages/EditProductPage.jsx';
import AdminOrdersPage from '@/pages/AdminOrdersPage.jsx';
import AdminInventoryPage from '@/pages/AdminInventoryPage.jsx';
import AdminCategoriesPage from '@/pages/AdminCategoriesPage.jsx';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/success" element={<SuccessPage />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/products"
                            element={
                                <AdminRoute>
                                    <AdminProductsPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/products/new"
                            element={
                                <AdminRoute>
                                    <CreateProductPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/products/:id"
                            element={
                                <AdminRoute>
                                    <EditProductPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <AdminRoute>
                                    <AdminOrdersPage />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/inventory"
                            element={
                                <AdminRoute>
                                    <AdminInventoryPage />
                                </AdminRoute>
                            }
                        />
                        <Route path="*" element={<NotFoundPage />} />
                        <Route
                            path="/admin/categories"
                            element={
                                <AdminRoute>
                                    <AdminCategoriesPage />
                                </AdminRoute>
                            }
                        />
                    </Routes>
                    <Toaster />
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-8">Página no encontrada</p>
                <a href="/">
                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200">
                        Volver al inicio
                    </button>
                </a>
            </div>
        </div>
    );
};

export default App;
