
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {ExpenseVO} from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {CalendarIcon, CreditCardIcon, TagIcon, InfoIcon, PencilIcon} from 'lucide-react';
import {format} from "date-fns";
import ExpenseForm from "@/components/ExpenseForm.tsx";

interface TransactionDetailsProps {
    transaction: ExpenseVO;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (expense: ExpenseVO) => void;
}

const TransactionDetails = ({ transaction, isOpen, onClose, onEdit }: TransactionDetailsProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Detalhes da Transação</DialogTitle>
                    <DialogDescription>
                        Informações completas sobre essa despesa
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-4">
                    {/* Transaction Header */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">{transaction.description}</h3>
                        <p className="text-xl font-bold text-destructive">
                            -{formatCurrency(transaction.amount)}
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Data</p>
                                <p className="font-medium">{format(transaction.date, 'dd/MM/yyyy')}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <TagIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Categoria</p>
                                <p className="font-medium">{transaction.category.name || 'Não categorizado'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Forma de Pagamento</p>
                                <p className="font-medium">{transaction.card?.name || 'Dinheiro'}</p>
                            </div>
                        </div>

                        {transaction.installments && (
                            <div className="flex items-center gap-2">
                                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Parcelas</p>
                                    <p className="font-medium">
                                        {transaction.currentInstallment}/{transaction.installments}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Fechar</Button>
                    {onEdit && (
                        <ExpenseForm onSubmit={onEdit} initialExpense={transaction}>
                            <Button variant="outline" className="gap-2">
                                <span>Editar</span>
                            </Button>
                        </ExpenseForm>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionDetails;
