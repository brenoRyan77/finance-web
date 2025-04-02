import React from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from '@/utils/formatters';
import {format, parseISO} from 'date-fns';
import {CardDetails, ExpenseVO} from '@/types';
import { ShoppingBag, Calendar } from 'lucide-react';

interface CardDetailsProps {
    card: CardDetails;
    expenses: ExpenseVO[];
    isOpen: boolean;
    onClose: () => void;
}

const CardDetailsModal = ({ card, expenses, isOpen, onClose }: CardDetailsProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: card.color }}
                        />
                        {card.name}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Detalhes do cartão e transações recentes
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 my-4">
                    {/* Card Info */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded-lg">
                        {card.closingDay && (
                            <div>
                                <p className="text-xs text-muted-foreground">Fechamento</p>
                                <p className="font-medium">Dia {card.closingDay}</p>
                            </div>
                        )}
                        {card.dueDay && (
                            <div>
                                <p className="text-xs text-muted-foreground">Vencimento</p>
                                <p className="font-medium">Dia {card.dueDay}</p>
                            </div>
                        )}
                        <div className="col-span-2">
                            <p className="text-xs text-muted-foreground">Total de gastos</p>
                            <p className="text-xl font-semibold">{formatCurrency(card.totalAmount)}</p>
                        </div>
                    </div>

                    {/* Transactions */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">Transações Recentes</h3>
                        {expenses.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {expenses.map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-sm">{expense.description}</p>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(parseISO(expense.date.toString()).setHours(12, 0, 0, 0)), 'dd/MM/yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="font-medium">{formatCurrency(expense.amount)}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm text-center py-4">
                                Nenhuma transação encontrada para este cartão.
                            </p>
                        )}
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Fechar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CardDetailsModal;