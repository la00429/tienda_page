import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';
import { formatCurrency } from '@/api/EcommerceApi.js';
import { Button } from '@/components/ui/button.jsx';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const total = getCartTotal();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-foreground/60 z-50"
                    onClick={() => setIsCartOpen(false)}
                >
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute right-0 top-0 h-full w-full max-w-md bg-card text-card-foreground shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <ShoppingCartIcon className="w-6 h-6" />
                                Carrito
                                {cartItems.length > 0 && (
                                    <span className="ml-1 text-sm bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                                        {cartItems.length}
                                    </span>
                                )}
                            </h2>
                            <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Items */}
                        <div className="flex-grow p-6 overflow-y-auto space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                                    <ShoppingCartIcon size={48} className="mb-4 opacity-30" />
                                    <p className="text-lg font-medium">Tu carrito está vacío</p>
                                    <p className="text-sm mt-1">Agrega productos desde el catálogo</p>
                                    <Button
                                        className="mt-4"
                                        variant="outline"
                                        onClick={() => setIsCartOpen(false)}
                                        asChild
                                    >
                                        <Link to="/products">Ver catálogo</Link>
                                    </Button>
                                </div>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 bg-muted/30 border p-3 rounded-lg">
                                        {item.product.images?.[0] ? (
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 flex items-center justify-center">
                                                <ShoppingCartIcon className="w-6 h-6 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        <div className="flex-grow min-w-0">
                                            <h3 className="font-semibold text-sm truncate">{item.product.name}</h3>
                                            {item.variant?.size && (
                                                <p className="text-xs text-muted-foreground">Talla: {item.variant.size}</p>
                                            )}
                                            <p className="text-sm font-bold text-primary mt-1">
                                                {formatCurrency(item.product.price * item.quantity)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <div className="flex items-center border rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 py-1 hover:bg-muted transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 py-1 hover:bg-muted transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-destructive hover:text-destructive/80 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                                </div>
                                <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                                    <Button className="w-full h-12 text-base group bg-[#25D366] hover:bg-[#128C7E] text-white">
                                        Pedir por WhatsApp
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/cart" onClick={() => setIsCartOpen(false)}>
                                    <Button variant="outline" className="w-full">
                                        Ver carrito completo
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShoppingCart;
