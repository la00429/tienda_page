import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'e-commerce-cart';

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((product, variant, quantity, availableQuantity) => {
        setCartItems(prevItems => {
            const variantKey = variant.id || variant.size || 'default';
            const existingItem = prevItems.find(item => (item.variant.id || item.variant.size || 'default') === variantKey && item.product.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    (item.variant.id || item.variant.size || 'default') === variantKey && item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { id: Date.now(), product, variant, quantity }];
        });
    }, []);

    const removeFromCart = useCallback((itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId, quantity) => {
        if (quantity <= 0) {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const getCartTotal = useCallback(() => {
        return cartItems.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + price * item.quantity;
        }, 0);
    }, [cartItems]);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
    }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
