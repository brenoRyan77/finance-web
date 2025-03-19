import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Trash } from 'lucide-react';
import { getSettings, saveSettings } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import { CardInfo } from '@/types';
import {CardDetails} from '@/types';
import CardDetailsModal from "@/components/CardDetails.tsx";
import {fetchCardsByUser} from "@/services/cardService.ts";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CardManager = () => {
    const [cards, setCards] = useState<CardInfo[]>([]);
    const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null);
    const [isCardDetailsOpen, setIsCardDetailsOpen] = useState<boolean>(false);
    const [cardToDelete, setCardToDelete] = useState<CardInfo | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const { toast } = useToast();

    useEffect(() => {
       const loadCards = async () => {
           try {
                const cards = await fetchCardsByUser();
                setCards(cards);
           }catch (error) {
               console.error('Error fetching cards', error);
           }
       };
         loadCards();
    }, []);

    const handleAddCard = () => {
        // Redirect to card selection page
        window.location.href = '/card-selection';
    };

    const confirmCardDeletion = (card: CardInfo, e: React.MouseEvent) => {
        e.stopPropagation();
        setCardToDelete(card);
        setIsDeleteDialogOpen(true);
    };

    const handleRemoveCard = () => {
        if (!cardToDelete) return;

        const settings = getSettings();
        const updatedCards = cards.filter(card => card.type !== cardToDelete.type);

        setCards(updatedCards);
        saveSettings({
            ...settings,
            configuredCards: updatedCards,
        });

        toast({
            title: "Cartão removido",
            description: "O cartão foi removido com sucesso",
            variant: "default",
        });

        setCardToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const handleOpenCardDetails = (card: CardInfo) => {
        const cardDetails: CardDetails = {
            id: card.id ?? 0,
            userCardId: card.userCardId ?? 0,
            type: card.type,
            name: card.name,
            color: card.color,
            icon: card.icon,
            closingDay: card.closingDay ?? 0,
            dueDay: card.dueDay ?? 0,
            totalAmount: 0,
            expenseVOS: [],
        };
        setSelectedCard(cardDetails);
        setIsCardDetailsOpen(true);
    };

    const handleCancelDelete = () => {
        setCardToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    return (
        <>
            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Gerenciamento de Cartões</h2>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {cards.map((card) => (
                            <Card
                                key={card.type}
                                className="relative cursor-pointer hover:shadow-md transition-shadow border border-border/70"
                                onClick={() => handleOpenCardDetails(card)}
                            >
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7 opacity-70 hover:opacity-100"
                                    onClick={(e) => confirmCardDeletion(card, e)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: card.color }}
                                    >
                                        <CreditCard className="h-5 w-5 text-white"/>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">{card.name}</h3>
                                        {card.closingDay && card.dueDay && (
                                            <p className="text-sm text-muted-foreground">
                                                Fecha dia {card.closingDay}, vence dia {card.dueDay}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Card
                            className="border-dashed border-2 cursor-pointer hover:bg-accent/30 transition-colors flex items-center justify-center min-h-[100px]"
                            onClick={handleAddCard}
                        >
                            <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                    <Plus className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-base font-medium">Adicionar Cartão</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Card Details Dialog */}
            {selectedCard && (
                <CardDetailsModal
                    card={selectedCard}
                    expenses={[]}
                    isOpen={isCardDetailsOpen}
                    onClose={() => setIsCardDetailsOpen(false)}
                />
            )}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o cartão {cardToDelete?.name}?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveCard} className="bg-destructive hover:bg-destructive/90">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CardManager;