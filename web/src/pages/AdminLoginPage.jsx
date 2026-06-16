import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { toast } from 'sonner';
import { Mail, Lock, Shield } from 'lucide-react';

const AdminLoginPage = () => {
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

        setIsLoading(true);

        const result = await login(email, password, true);

        setIsLoading(false);

        if (result.success) {
            toast.success('Acceso administrativo concedido');
            navigate('/admin');
        } else {
            toast.error(result.error || 'Credenciales de administrador inválidas');
        }
    };

    return (
        <>
            <Helmet>
                <title>Admin Login - ProSport</title>
                <meta name="description" content="Panel de administración de ProSport" />
            </Helmet>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-12">
                <Card className="w-full max-w-md shadow-xl border-2">
                    <CardHeader className="space-y-1 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Acceso administrativo</CardTitle>
                        <CardDescription>
                            Ingresa tus credenciales de administrador
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email de administrador</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@prosport.com"
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
                                {isLoading ? 'Verificando...' : 'Acceder al panel'}
                            </Button>

                            <div className="bg-muted/50 rounded-lg p-4 text-sm">
                                <p className="font-medium mb-1">Credenciales de prueba:</p>
                                <p className="text-muted-foreground">Email: admin@sportswear.com</p>
                                <p className="text-muted-foreground">Contraseña: admin123</p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AdminLoginPage;
