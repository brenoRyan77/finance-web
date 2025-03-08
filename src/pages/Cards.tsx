import {useState, useEffect} from 'react';
import Header from '@/components/Header';
import {Button} from '@/components/ui/button';
import {addMonths, subMonths, format, startOfMonth, endOfMonth} from 'date-fns';
import {CardDetails} from '@/types';
import {formatCurrency, formatMonthYear} from '@/utils/formatters';
import {Calendar, CreditCard, DollarSign, Loader} from 'lucide-react';
import {fetchCardWithExpenses} from "@/services/userCardService.ts";
import CardDetailsModal from "@/components/CardDetails";

const Cards = () => {
    const [cards, setCards] = useState<CardDetails[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null);

    useEffect(() => {
        const loadCards = async () => {
            setIsLoading(true);
            try {
                const cardDetails = await fetchCardWithExpenses(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
                setCards(cardDetails);
            } catch (error) {
                console.error('Error loading cards:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCards();
    }, [selectedDate]);

    const handlePreviousMonth = () => {
        setSelectedDate(prev => subMonths(prev, 1));
    };

    const handleNextMonth = () => {
        setSelectedDate(prev => addMonths(prev, 1));
    };

    const getCardTotal = (cardId: number) => {
        const card = cards.find(card => card.id === cardId);
        return card ? card.totalAmount : 0;
    };

    const getNextDueDate = (card: CardDetails) => {
        if (!card.dueDay) return null;

        let dueDate = new Date(selectedDate);
        dueDate.setDate(card.dueDay);

        if (dueDate < new Date()) {
            dueDate = addMonths(dueDate, 1);
        }

        return dueDate;
    };

    const handleCardDetails = (card: CardDetails) => {
        setSelectedCard(card);
    };


    const handleCloseCardDetails = () => {
        setSelectedCard(null);
    };

    const getCardExpenses = (cardId: number) => {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);

        const card = cards.find(card => card.id === cardId);
        if (!card) return [];

        return card.expenseVOS.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= monthStart && expenseDate <= monthEnd;
        });
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header/>
                <div className="flex justify-center items-center h-screen">
                    <Loader className="animate-spin h-10 w-10 text-primary"/>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header/>

            <main className="container mx-auto px-4 pt-24 pb-14">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold tracking-tight">Cartões</h1>
                    <p className="text-muted-foreground">Gerenciamento de faturas e limites</p>
                </div>

                {/* Month Selector */}
                <div className="flex items-center gap-2 mb-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePreviousMonth}
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                    </Button>

                    <div className="bg-muted px-3 py-1 rounded font-medium">
                        {formatMonthYear(selectedDate)}
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextMonth}
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                    </Button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {cards.map(card => {
                        const cardTotal = getCardTotal(card.id);
                        const dueDate = getNextDueDate(card);

                        return (
                            <div
                                key={card.id}
                                className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-card"
                            >
                                {/* Card Header */}
                                <div
                                    className="p-4 text-white flex justify-between items-center"
                                    style={{backgroundColor: card.color}}
                                >
                                    <h3 className="font-medium">{card.name}</h3>
                                    <CreditCard className="h-5 w-5"/>
                                </div>

                                {/* Card Content */}
                                <div className="p-4">
                                    <div className="mb-4">
                                        <div className="text-muted-foreground text-sm mb-1">Fatura do mês</div>
                                        <div className="text-2xl font-semibold">{formatCurrency(cardTotal)}</div>
                                    </div>

                                    {card.closingDay && (
                                        <div className="flex justify-between items-center py-2 border-t">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                                <span className="text-sm">Fechamento</span>
                                            </div>
                                            <span className="text-sm font-medium">Dia {card.closingDay}</span>
                                        </div>
                                    )}

                                    {card.dueDay && (
                                        <div className="flex justify-between items-center py-2 border-t">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-muted-foreground"/>
                                                <span className="text-sm">Vencimento</span>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {dueDate ? format(dueDate, 'dd/MM/yyyy') : `Dia ${card.dueDay}`}
                                            </span>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => handleCardDetails(card)}
                                        >
                                            Ver Detalhes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {selectedCard && (
                    <CardDetailsModal
                        card={selectedCard}
                        expenses={getCardExpenses(selectedCard.id)}
                        onClose={handleCloseCardDetails}
                        isOpen={!!selectedCard}
                    />
                )}
            </main>
        </div>
    );
};

// Wallet icon component
const Wallet = (props: React.SVGProps<SVGSVGElement>) => (
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
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
    </svg>
);

export default Cards;
