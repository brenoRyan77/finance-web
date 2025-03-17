import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, User, Mail, Lock } from 'lucide-react';
import { createUser } from "@/services/userService.ts";

interface PreRegistrationFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const PreRegistration = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState<PreRegistrationFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validações básicas
        if (!formData.name || !formData.email || !formData.password) {
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Por favor, preencha todos os campos obrigatórios.",
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast({
                variant: "destructive",
                title: "Senhas não conferem",
                description: "A senha e a confirmação de senha devem ser iguais.",
            });
            return;
        }

        if (formData.password.length < 6) {
            toast({
                variant: "destructive",
                title: "Senha muito curta",
                description: "A senha deve ter pelo menos 6 caracteres.",
            });
            return;
        }

        setIsLoading(true);

        try{
            await createUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            setIsSubmitted(true);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao enviar solicitação",
                description: "Ocorreu um erro ao enviar sua solicitação de cadastro. Por favor, tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturn = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Pré-Cadastro</CardTitle>
                    <CardDescription className="text-center">
                        {!isSubmitted ? 'Faça seu pré-cadastro para acessar o sistema' : 'Solicitação enviada com sucesso'}
                    </CardDescription>
                </CardHeader>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome completo</Label>
                                <div className="relative">
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Mínimo de 6 caracteres
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Enviando..." : "Enviar pré-cadastro"}
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">Já possui uma conta?</span>{" "}
                                <a
                                    href="/login"
                                    className="text-primary hover:underline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/login');
                                    }}
                                >
                                    Faça login
                                </a>
                            </div>
                        </CardFooter>
                    </form>
                ) : (
                    <CardContent className="space-y-6 pt-4">
                        <Alert className="bg-green-50 border-green-200">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <AlertTitle className="text-green-800">Solicitação recebida!</AlertTitle>
                            <AlertDescription className="text-green-700">
                                Sua solicitação de cadastro foi recebida com sucesso. Os administradores do sistema
                                irão analisar suas informações e validar seu cadastro em breve.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-2 text-center text-muted-foreground text-sm">
                            <p>Você receberá um email quando seu cadastro for aprovado.</p>
                            <p>Verifique também sua caixa de spam.</p>
                        </div>

                        <Button
                            onClick={handleReturn}
                            className="w-full"
                        >
                            Voltar para o login
                        </Button>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

export default PreRegistration;