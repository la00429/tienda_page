import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import CartDrawer from '@/components/ShoppingCart.jsx';

const Header = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cartItems } = useCart();
    const { isAdmin, logout } = useAuth();
    const location = useLocation();

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Inicio' },
        { path: '/products', label: 'Catálogo' }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg"></div>
                                <span className="text-xl font-bold tracking-tight">ProSport</span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                                            ? 'text-primary font-semibold'
                                            : 'text-foreground/80 hover:text-foreground'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            <form onSubmit={handleSearch} className="hidden lg:block">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Buscar productos..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-64 text-foreground"
                                    />
                                </div>
                            </form>

                            {isAdmin ? (
                                <>
                                    <Link to="/admin">
                                        <Button variant="ghost" size="sm">
                                            <User className="w-4 h-4 mr-2" />
                                            Admin
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" onClick={logout}>
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </>
                            ) : (
                                <Link to="/admin/login" className="hidden md:block">
                                    <Button variant="outline" size="sm">Admin</Button>
                                </Link>
                            )}

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t">
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                                            ? 'text-primary font-semibold'
                                            : 'text-foreground/80'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <form onSubmit={handleSearch} className="lg:hidden">
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
                                </form>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            <CartDrawer isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
        </>
    );
};

export default Header;
