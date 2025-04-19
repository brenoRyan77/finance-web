import {CardInfo, CategoryVO, ExpenseVO} from '@/types';
import {formatCurrency} from '@/utils/formatters';
import {CreditCard, Banknote, CalendarClock, BadgeDollarSign, Trash2} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useEffect, useState} from "react";
import {fetchCategories} from "@/services/categoryService.ts";
import {fetchCards} from "@/services/cardService.ts";
import {format, parseISO} from "date-fns";
import TransactionDetails from "@/components/TransactionDetails.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {useIsMobile} from "@/hooks/use-mobile.tsx";
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
import { Button } from './ui/button';


interface TransactionItemProps {
    transaction: ExpenseVO;
    onClick?: () => void;
    onDelete?: (id: string) => void;
    showDetailsInline?: boolean; //
}

const TransactionItem = ({transaction, onClick, onDelete, showDetailsInline = true}: TransactionItemProps) => {
    const [categories, setCategories] = useState<CategoryVO[]>([]);
    const [cards, setCards] = useState<CardInfo[]>([]);
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { toast } = useToast();
    const isMobile = useIsMobile();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategories();
                setCategories(response);
            } catch (error) {
                console.error(error);
            }
        };

        const loadCards = async () => {
            try {
                const response = await fetchCards();
                setCards(response);
            } catch (error) {
                console.error(error);
            }
        };

        loadCategories();
        loadCards();

    }, []);
    const category = categories.find(cat => cat.id === transaction.category.id);

    const card = transaction.card ? cards.find(c => c.type === transaction.card.type) : null;

    const getPaymentIcon = () => {
        switch (transaction.paymentMethod) {
            case 'cash':
                return <Banknote className="h-4 w-4"/>;
            case 'installment':
                return <CalendarClock className="h-4 w-4"/>;
            case 'one-time':
                return transaction.card && transaction.card.type === 'cash'
                    ? <Banknote className="h-4 w-4"/>
                    : <CreditCard className="h-4 w-4"/>;
            default:
                return <BadgeDollarSign className="h-4 w-4"/>;
        }
    };

    const handleClick = () => {
        // If we're not supposed to show details inline, always use the parent's onClick handler
        if (!showDetailsInline) {
            if (onClick) onClick();
            return;
        }

        // Only show details inline on mobile when showDetailsInline is true
        if (isMobile && showDetailsInline) {
            setShowDetails(true);
        }
        // On desktop or when not showing details inline, use the parent's onClick if provided
        else if (onClick) {
            onClick();
        }
    };

    const getInstallmentText = () => {
        if (transaction.paymentMethod === 'installment' && transaction.installments && transaction.currentInstallment) {
            return ` (${transaction.currentInstallment}/${transaction.installments})`;
        }
        return '';
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (onDelete) {
            onDelete(transaction.id);
            toast({
                title: "Despesa excluída",
                description: "A despesa foi excluída com sucesso",
            });
        }
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div
                className={cn(
                    "group flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                    "hover:bg-primary/5 cursor-pointer border border-transparent hover:border-border/50",
                    "active:bg-primary/10", // Added active state for better mobile feedback
                    "relative" // Added to position the delete button
                )}
                onClick={handleClick}
            >
                <div className="flex items-center space-x-3">
                    {/* Category circle */}
                    <div
                        className="rounded-full p-2.5 flex-shrink-0"
                        style={{backgroundColor: category?.color + '33', color: category?.color}}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"
                                  className="fill-current"/>
                            <path d="M14.5 9h-5l-1 6h7l-1-6z" fill="white"/>
                        </svg>
                    </div>

                    {/* Transaction info */}
                    <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                            <span>{format(new Date(parseISO(transaction.date.toString()).setHours(12, 0, 0, 0)), 'dd/MM/yyyy')}</span>
                            <span className="mx-1.5">•</span>
                            <span className="flex items-center">
                                {getPaymentIcon()}
                                <span className="ml-1">
                    {card?.name || 'Dinheiro'}{getInstallmentText()}
                  </span>
                </span>
                        </div>
                    </div>
                </div>

                {/* Right side: Amount */}
                <div className="text-right flex items-center gap-3">
                    <div>
                        <p className="font-medium text-destructive">
                            -{formatCurrency(transaction.amount)}
                        </p>
                        {category && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {category.name}
                            </p>
                        )}
                    </div>

                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10",
                                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
                            )}
                            onClick={handleDeleteClick}
                            aria-label="Excluir transação"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>

            </div>
            {/* Transaction Details Dialog */}
            {showDetailsInline && (
                <TransactionDetails
                    transaction={transaction}
                    isOpen={showDetails}
                    onClose={() => setShowDetails(false)}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir a despesa "{transaction.description}"?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default TransactionItem;
