import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const SuccessPage = () => {
    return (
        <>
            <Helmet>
                <title>Pedido confirmado - ProSport</title>
                <meta name="description" content="Tu pedido ha sido confirmado correctamente" />
            </Helmet>

            <Header />

            <main className="min-h-screen bg-background">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Pedido confirmado</h1>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando. Recibirás un email de confirmación en breve.
                        </p>

                        <Card className="shadow-lg mb-8">
                            <CardContent className="p-8">
                                <div className="flex items-start gap-4 text-left">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Package className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">¿Qué sigue?</h2>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>Recibirás un email de confirmación con los detalles de tu pedido</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>Procesaremos tu pedido en las próximas 24 horas</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>Te enviaremos un código de seguimiento cuando tu pedido sea enviado</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span>Puedes revisar el estado de tu pedido en tu cuenta</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/account">
                                <Button size="lg" className="group">
                                    Ver mis pedidos
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </Button>
                            </Link>
                            <Link to="/products">
                                <Button size="lg" variant="outline">
                                    Seguir comprando
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default SuccessPage;
