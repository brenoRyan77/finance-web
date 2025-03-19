import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PersonalInfoForm = () => {
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const { toast } = useToast();

    useEffect(() => {
        // Load user data from localStorage
        const userData = sessionStorage.getItem('user');

        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserEmail(parsedUser.email || '');
            setUserName(parsedUser.name || '');
        }
    }, []);

    const handleSaveProfile = () => {
        const userData = localStorage.getItem('user');
        let parsedUser = userData ? JSON.parse(userData) : {};

        parsedUser = {
            ...parsedUser,
            name: userName,
            email: userEmail
        };

        localStorage.setItem('user', JSON.stringify(parsedUser));

        toast({
            title: "Perfil atualizado",
            description: "Suas informações pessoais foram atualizadas com sucesso",
        });
    };

    return (
        <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Informações Pessoais</h2>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="user-name">Nome</Label>
                    <Input
                        id="user-name"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Seu nome"
                        disabled={true}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                        id="user-email"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="seu@email.com"
                        disabled={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;