
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getSettings, saveSettings, clearAllData } from '@/utils/localStorage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';

const Settings = () => {
  const [fixedIncome, setFixedIncome] = useState<string>('4750');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const settings = getSettings();
    if (settings.fixedIncome) {
      setFixedIncome(settings.fixedIncome.toString());
    }
    
    // Check for dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    setDarkMode(isDarkMode);
  }, []);

  const handleSaveSettings = () => {
    const parsedIncome = parseFloat(fixedIncome.replace(',', '.')) || 4750;
    
    saveSettings({
      fixedIncome: parsedIncome,
      darkMode: darkMode,
    });
    
    toast({
      title: "Configurações salvas",
      description: `Renda mensal definida como ${formatCurrency(parsedIncome)}`,
    });
  };

  const handleClearData = () => {
    clearAllData();
    toast({
      title: "Dados apagados",
      description: "Todos os dados foram apagados com sucesso",
      variant: "destructive",
    });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save the setting
    const settings = getSettings();
    saveSettings({
      ...settings,
      darkMode: checked,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-14">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Personalize sua experiência</p>
        </div>
        
        {/* Income Settings */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-card mb-6">
          <h2 className="text-xl font-medium mb-4">Configurações Financeiras</h2>
          
          <div className="space-y-4">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="fixed-income">Renda Mensal Fixa</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                <Input 
                  id="fixed-income" 
                  type="text"
                  value={fixedIncome}
                  onChange={(e) => {
                    // Allow only numbers and decimal separator
                    const value = e.target.value.replace(/[^0-9,]/g, '');
                    setFixedIncome(value);
                  }}
                  className="pl-9"
                  placeholder="0,00"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Define sua renda mensal fixa para cálculos de orçamento
              </p>
            </div>
            
            <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
          </div>
        </div>
        
        {/* Appearance Settings */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-card mb-6">
          <h2 className="text-xl font-medium mb-4">Aparência</h2>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">
                Ative para usar o tema escuro
              </p>
            </div>
            <Switch 
              id="dark-mode" 
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </div>
        
        {/* Data Management */}
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-card">
          <h2 className="text-xl font-medium mb-4">Gerenciamento de Dados</h2>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-destructive">Zona de Perigo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                As ações abaixo não podem ser desfeitas. Tenha cuidado.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Apagar Todos os Dados</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isto irá apagar permanentemente todos os seus dados,
                      incluindo despesas, receitas e configurações de cartões.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearData}>
                      Sim, apagar tudo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
