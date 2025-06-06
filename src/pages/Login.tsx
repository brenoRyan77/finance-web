
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {LoginRequest} from "@/types";
import { login } from "@/services/authService";
import {getUserByLogin} from "@/services/userService.ts";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<LoginRequest>({
    login: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await login(credentials);
      if(!response.authenticated){
        toast({
            variant: "destructive",
            title: "Falha no login",
            description: "Email ou senha inválidos. A senha deve ter pelo menos 6 caracteres.",
        })
        return;
      }

      sessionStorage.setItem('token', response.accessToken);

      const responseUser = await getUserByLogin(response.username);
      sessionStorage.setItem('user', JSON.stringify(responseUser));

      if (!responseUser.userCards || responseUser.userCards.length === 0) {
        navigate('/initial-setup', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      const parsedError = JSON.parse(error.message);
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: parsedError.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">FinTrack</CardTitle>
          <CardDescription className="text-center">
            Digite seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Email</Label>
              <Input 
                id="login"
                name="login"
                type="login"
                placeholder="seu@email.com"
                value={credentials.login}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a 
                  href="#" 
                  className="text-sm text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      description: "Função de recuperação de senha não implementada nesta versão.",
                    });
                  }}
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input 
                id="password"
                name="password"
                type="password" 
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Ainda não tem uma conta?</span>{" "}
              <a
                  href="/pre-registration"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/pre-registration');
                  }}
              >
                Solicite seu cadastro
              </a>
            </div>

            <p className="text-sm text-center text-muted-foreground mt-2">
              Ao continuar, você concorda com nossos{" "}
              <a href="#" className="text-primary hover:underline">Termos de Serviço</a>
              {" "}e{" "}
              <a href="#" className="text-primary hover:underline">Política de Privacidade</a>.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
