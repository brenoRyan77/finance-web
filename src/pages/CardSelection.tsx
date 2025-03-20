import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getSettings, saveSettings } from '@/utils/localStorage';
import {CardInfo, InitialSetup, UserVO} from '@/types';
import {fetchCards} from "@/services/cardService.ts";
import {initialSetup} from "@/services/userService.ts";
import {getInitialSetup} from "@/services/incomeService.ts";

interface CardSelectionState {
    [key: string]: {
        selected: boolean;
        closingDay: string;
        dueDay: string;
    }
}

const CardSelection = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [monthlyIncome, setMonthlyIncome] = useState<string>('4750');
    const [cards, setCards] = useState<CardInfo[]>([]);
    const [initialSetupInfo, setInitialSetupInfo] = useState<InitialSetup | null>(null);
    const [cardSelections, setCardSelections] = useState<CardSelectionState>({});

    useEffect(() => {
        const loadCards = async () => {
            try {
                const cardData = await fetchCards();
                setCards(cardData);
            } catch (error) {
                console.error("Error loading cards:", error);
            }
        };

        const loadCardByUser = async () => {
            try {
                const cardData = await getInitialSetup();
                setInitialSetupInfo(cardData);
            } catch (error) {
                console.error("Error loading user cards:", error);
            }
        };

        // Executa as funções assíncronas
        loadCards();
        loadCardByUser();
    }, []);

    useEffect(() => {
        if (initialSetupInfo) {
            setMonthlyIncome(initialSetupInfo.income?.amount?.toString() || '');

            const updatedSelections: CardSelectionState = {};
            cards.forEach(card => {
                if (card.type !== 'cash') {
                    const existingCard = initialSetupInfo.userCards.find(userCard => userCard.card.type === card.type);
                    updatedSelections[card.type] = {
                        selected: !!existingCard,
                        closingDay: existingCard?.closingDay?.toString() || '',
                        dueDay: existingCard?.dueDay?.toString() || ''
                    };
                }
            });

            setCardSelections(updatedSelections);
        }
    }, [initialSetupInfo, cards]);

    const handleCardSelection = (cardType: string, checked: boolean) => {
        setCardSelections(prev => ({
            ...prev,
            [cardType]: {
                ...prev[cardType],
                selected: checked
            }
        }));
    };

    const handleClosingDayChange = (cardType: string, value: string) => {
        const day = value.replace(/[^0-9]/g, '');
        if (day === '' || (parseInt(day) >= 1 && parseInt(day) <= 31)) {
            setCardSelections(prev => ({
                ...prev,
                [cardType]: {
                    ...prev[cardType],
                    closingDay: day
                }
            }));
        }
    };

    const handleDueDayChange = (cardType: string, value: string) => {
        // Allow only numbers between 1-31
        const day = value.replace(/[^0-9]/g, '');
        if (day === '' || (parseInt(day) >= 1 && parseInt(day) <= 31)) {
            setCardSelections(prev => ({
                ...prev,
                [cardType]: {
                    ...prev[cardType],
                    dueDay: day
                }
            }));
        }
    };

    const handleSave = async () => {
        let isValid = true;
        let errorMessage = '';

        const hasSelectedCard = Object.values(cardSelections).some(card => card.selected);

        if (!hasSelectedCard) {
            isValid = false;
            errorMessage = 'Selecione pelo menos um cartão.';
        }

        Object.entries(cardSelections).forEach(([cardType, cardData]) => {
            if (cardData.selected) {
                if (!cardData.closingDay) {
                    isValid = false;
                    errorMessage = 'Informe o dia de fechamento para todos os cartões selecionados.';
                }
                if (!cardData.dueDay) {
                    isValid = false;
                    errorMessage = 'Informe o dia de vencimento para todos os cartões selecionados.';
                }
            }
        });

        if (!monthlyIncome || parseFloat(monthlyIncome.replace(',', '.')) <= 0) {
            isValid = false;
            errorMessage = 'Informe uma renda mensal válida.';
        }

        if (!isValid) {
            toast({
                title: "Erro",
                description: errorMessage,
                variant: "destructive"
            });
            return;
        }

        const currentSettings = getSettings();

        const configuredCards: CardInfo[] = [];

        const cashCard = cards.find(card => card.type === 'cash');
        if (cashCard) configuredCards.push(cashCard);

        Object.entries(cardSelections).forEach(([cardType, cardData]) => {
            if (cardData.selected) {
                const card = cards.find(c => c.type === cardType);
                if (card) {
                    configuredCards.push({
                        ...card,
                        closingDay: parseInt(cardData.closingDay),
                        dueDay: parseInt(cardData.dueDay)
                    });
                }
            }
        });

        // Save settings
        saveSettings({
            ...currentSettings,
            fixedIncome: parseFloat(monthlyIncome.replace(',', '.')),
            configuredCards: configuredCards,
            setupComplete: true,
            setupDate: new Date().toISOString()
        });

        const user: UserVO = JSON.parse(sessionStorage.getItem('user') || '{}')
        const data: InitialSetup = {
            userId: user.id,
            userCards: configuredCards.map(card => ({
                closingDay: card.closingDay,
                dueDay: card.dueDay,
                card: {
                    id: card.id,
                    type: card.type,
                    name: card.name,
                    color: card.color,
                    icon: card.icon
                }
            })),
            income: {
                amount: parseFloat(monthlyIncome.replace(',', '.')),
                description: 'Renda mensal'
            }
        };
       try {

           await initialSetup(data);

           toast({
               title: "Configuração concluída",
               description: "Suas preferências foram salvas com sucesso!",
           });
           navigate('/', { replace: true });

       }catch (error){
           console.error('Error saving user:', error);
           toast({
               title: "Erro",
               description: "Ocorreu um erro ao salvar suas preferências. Tente novamente.",
               variant: "destructive"
           });
       }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-card border border-border/50 rounded-xl p-6 shadow-card">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight">Configuração Inicial</h1>
                    <p className="text-muted-foreground mt-2">Configure seus cartões e renda mensal para começar</p>
                </div>

                {/* Monthly Income */}
                <div className="mb-8">
                    <h2 className="text-xl font-medium mb-4">Qual é a sua renda mensal?</h2>
                    <div className="relative max-w-sm">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                        <Input
                            type="text"
                            value={monthlyIncome}
                            onChange={(e) => {
                                // Allow only numbers and decimal separator
                                const value = e.target.value.replace(/[^0-9,]/g, '');
                                setMonthlyIncome(value);
                            }}
                            className="pl-9"
                            placeholder="0,00"
                        />
                    </div>
                </div>

                {/* Card Selection */}
                <div className="mb-8">
                    <h2 className="text-xl font-medium mb-4">Quais cartões você usa?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cards.map(card => {
                            // Skip cash "card"
                            if (card.type === 'cash') return null;

                            return (
                                <div
                                    key={card.id}
                                    className="border border-border/50 rounded-lg p-4"
                                >
                                    <div className="flex items-center mb-4">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                                            style={{ backgroundColor: card.color }}
                                        >
                                            <CreditCardIcon className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`card-${card.type}`}
                                                checked={cardSelections[card.type]?.selected || false}
                                                onCheckedChange={(checked) =>
                                                    handleCardSelection(card.type, checked === true)
                                                }
                                            />
                                            <Label
                                                htmlFor={`card-${card.type}`}
                                                className="text-base font-medium"
                                            >
                                                {card.name}
                                            </Label>
                                        </div>
                                    </div>

                                    {cardSelections[card.type]?.selected && (
                                        <div className="space-y-3 pl-10">
                                            <div className="space-y-1">
                                                <Label htmlFor={`closing-${card.type}`}>
                                                    Dia de fechamento
                                                </Label>
                                                <Input
                                                    id={`closing-${card.type}`}
                                                    value={cardSelections[card.type]?.closingDay || ''}
                                                    onChange={(e) => handleClosingDayChange(card.type, e.target.value)}
                                                    placeholder="1-31"
                                                    maxLength={2}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`due-${card.type}`}>
                                                    Dia de vencimento
                                                </Label>
                                                <Input
                                                    id={`due-${card.type}`}
                                                    value={cardSelections[card.type]?.dueDay || ''}
                                                    onChange={(e) => handleDueDayChange(card.type, e.target.value)}
                                                    placeholder="1-31"
                                                    maxLength={2}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave} size="lg">
                        Concluir Configuração
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Credit Card Icon Component
const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
);

export default CardSelection;
