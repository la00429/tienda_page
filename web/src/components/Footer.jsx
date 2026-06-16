import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted text-muted-foreground border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg"></div>
                            <span className="text-xl font-bold text-foreground">ProSport</span>
                        </div>
                        <p className="text-sm mb-4">
                            Tu tienda de confianza para ropa deportiva de alta calidad. Equipamos a atletas de todos los niveles.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <span className="font-semibold text-foreground mb-4 block">Enlaces rápidos</span>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/products" className="hover:text-foreground transition-colors duration-200">Productos</Link></li>
                            <li><Link to="/account" className="hover:text-foreground transition-colors duration-200">Mi cuenta</Link></li>
                            <li><Link to="/cart" className="hover:text-foreground transition-colors duration-200">Carrito</Link></li>
                            <li><Link to="/products?category=ofertas" className="hover:text-foreground transition-colors duration-200">Ofertas</Link></li>
                        </ul>
                    </div>

                    <div>
                        <span className="font-semibold text-foreground mb-4 block">Categorías</span>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/products?category=camisetas" className="hover:text-foreground transition-colors duration-200">Camisetas</Link></li>
                            <li><Link to="/products?category=pantalones" className="hover:text-foreground transition-colors duration-200">Pantalones</Link></li>
                            <li><Link to="/products?category=accesorios" className="hover:text-foreground transition-colors duration-200">Accesorios</Link></li>
                            <li><Link to="/products?category=calzado" className="hover:text-foreground transition-colors duration-200">Calzado</Link></li>
                        </ul>
                    </div>

                    <div>
                        <span className="font-semibold text-foreground mb-4 block">Contacto</span>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>contacto@prosport.com</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>+34 912 345 678</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>Calle Deportiva 123, Madrid, España</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; {currentYear} ProSport. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-foreground transition-colors duration-200">Política de privacidad</Link>
                        <Link to="/terms" className="hover:text-foreground transition-colors duration-200">Términos de servicio</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
