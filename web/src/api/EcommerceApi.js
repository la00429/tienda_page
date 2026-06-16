export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
};

export const getProducts = async () => {
    return {
        success: true,
        data: [
            {
                id: '1',
                name: 'Auriculares Inalámbricos',
                description: 'Auriculares con cancelación de ruido y sonido de alta fidelidad.',
                price: 1299.00,
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
                category: 'Electrónica',
                stock: 15
            },
            {
                id: '2',
                name: 'Reloj Inteligente',
                description: 'Reloj inteligente con monitor de frecuencia cardíaca y GPS.',
                price: 899.50,
                imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
                category: 'Accesorios',
                stock: 20
            },
            {
                id: '3',
                name: 'Cámara Deportiva 4K',
                description: 'Cámara de acción resistente al agua con accesorios.',
                price: 2499.00,
                imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
                category: 'Fotografía',
                stock: 5
            }
        ]
    };
};

export const getProduct = async (id) => {
    const productsResponse = await getProducts();
    const product = productsResponse.data.find(p => p.id === id) || productsResponse.data[0];
    return {
        success: true,
        data: product
    };
};

export const getProductQuantities = async () => {
    return {
        '1': 15,
        '2': 20,
        '3': 5
    };
};

export const initializeCheckout = async (items) => {
    console.log("Mock Checkout iniciado con items:", items);
    return {
        checkoutId: 'mock-checkout-12345',
        url: '/success'
    };
};

export const updateProduct = async (id, productData) => {
    console.log('Actualizando producto:', id, productData);

    return {
        success: true,
        data: {
            id,
            ...productData
        }
    };
};
