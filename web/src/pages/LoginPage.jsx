import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { toast } from 'sonner';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        if (!email.includes('@')) {
            toast.error('Por favor ingresa un email válido');
            return;
        }

        setIsLoading(true);

        const result = await login(email, password, false);

        setIsLoading(false);

        if (result.success) {
            toast.success('Sesión iniciada correctamente');
            navigate('/');
        } else {
            toast.error(result.error || 'Error al iniciar sesión');
        }
    };

    return (
        <>
            <Helmet>
                <title>Iniciar sesión - ProSport</title>
                <meta name="description" content="Inicia sesión en tu cuenta de ProSport para acceder a tus pedidos y preferencias." />
            </Helmet>

            <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
                        <CardDescription>
                            Ingresa tu email y contraseña para acceder a tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 text-foreground"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 text-foreground"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">¿No tienes cuenta? </span>
                                <Link to="/signup" className="text-primary hover:underline font-medium">
                                    Regístrate
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default LoginPage;
