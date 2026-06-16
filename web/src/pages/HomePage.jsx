import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getCategories } from '@/api/CategoryApi.js';

const HomePage = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getCategories();
            if (response.success) {
                // We provide static images for known categories just in case
                const imageMap = {
                    'camisetas': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
                    'pantalones': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8',
                    'accesorios': 'https://images.unsplash.com/photo-1556906781-9a412961c28c',
                    'calzado': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
                };
                const finalCategories = response.data.map(cat => ({
                    name: cat.charAt(0).toUpperCase() + cat.slice(1),
                    link: `/products?category=${cat}`,
                    image: imageMap[cat] || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438'
                }));
                setCategories(finalCategories);
            }
        };
        fetchCategories();
    }, []);

    const features = [
        {
            icon: Zap,
            title: 'Rendimiento superior',
            description: 'Tecnología avanzada en cada prenda para maximizar tu desempeño deportivo'
        },
        {
            icon: Shield,
            title: 'Calidad garantizada',
            description: 'Materiales premium que resisten el entrenamiento más intenso'
        },
        {
            icon: Truck,
            title: 'Envío rápido',
            description: 'Recibe tus productos en 24-48 horas en toda Colombia'
        }
    ];

    return (
        <>
            <Helmet>
                <title>ProSport - Ropa deportiva de alta calidad</title>
                <meta name="description" content="Descubre la mejor ropa deportiva para entrenar. Camisetas, pantalones, accesorios y calzado de alto rendimiento." />
            </Helmet>

            <Header />

            <main>
                <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1650289090342-ab792ac872c4"
                            alt="Atleta entrenando con ropa deportiva ProSport"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-2xl"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                                Entrena con la mejor ropa deportiva
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-prose">
                                Descubre nuestra colección de ropa deportiva diseñada para atletas que buscan rendimiento y estilo. Calidad premium para cada entrenamiento.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/products">
                                    <Button size="lg" className="group">
                                        Ver catálogo
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Button>
                                </Link>
                                <Link to="/products?category=ofertas">
                                    <Button size="lg" variant="outline">
                                        Ver ofertas
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="py-20 bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="h-full shadow-sm hover:shadow-lg transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                                <feature.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explora nuestras categorías</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Encuentra el equipamiento perfecto para tu deporte favorito
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={index === 0 ? 'md:col-span-2' : ''}
                                >
                                    <Link to={category.link}>
                                        <Card className="overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                            <div className="relative h-64 md:h-80 overflow-hidden">
                                                <img
                                                    src={category.image}
                                                    alt={`Categoría ${category.name}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{category.name}</h3>
                                                    <Button variant="secondary" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                                                        Ver productos
                                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Compra directa y segura por WhatsApp
                            </h2>
                            <p className="text-lg mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto">
                                Encuentra lo que buscas, añádelo a tu carrito y haz tu pedido directamente por WhatsApp sin necesidad de crear cuenta.
                            </p>
                            <Link to="/products">
                                <Button size="lg" variant="secondary" className="group">
                                    Ver catálogo
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default HomePage;
