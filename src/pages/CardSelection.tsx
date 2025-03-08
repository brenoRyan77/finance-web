import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getSettings, saveSettings } from '@/utils/localStorage';
import { CardInfo } from '@/types';
import {fetchCards} from "@/services/cardService.ts";

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

    useEffect(() => {
        const loadCards = async () => {
            try{
                const cardData = await fetchCards();
                console.log('Card data:', cardData);
                setCards(cardData);
            }catch (error){
                console.error('Error loading cards:', error);
            }
        };
        loadCards();
    }, []);

    const [cardSelections, setCardSelections] = useState<CardSelectionState>(() => {
        const initialState: CardSelectionState = {};
        cards.forEach(card => {
            if (card.type !== 'cash') { // Cash is always included
                initialState[card.type] = {
                    selected: false,
                    closingDay: card.closingDay?.toString() || '',
                    dueDay: card.dueDay?.toString() || ''
                };
            }
        });
        return initialState;
    });

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

    const handleSave = () => {
        // Validate form
        let isValid = true;
        let errorMessage = '';

        // Check if at least one card is selected
        const hasSelectedCard = Object.values(cardSelections).some(card => card.selected);

        if (!hasSelectedCard) {
            isValid = false;
            errorMessage = 'Selecione pelo menos um cartão.';
        }

        // Check if selected cards have closing and due days
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

        // Check if monthly income is provided
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

        // Get current settings
        const currentSettings = getSettings();

        // Prepare configured cards
        const configuredCards: CardInfo[] = [];

        // Always include cash as an option
        const cashCard = cards.find(card => card.type === 'cash');
        if (cashCard) configuredCards.push(cashCard);

        // Add selected credit cards
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

        toast({
            title: "Configuração concluída",
            description: "Suas preferências foram salvas com sucesso!",
        });

        // Redirect to dashboard
        navigate('/');
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
