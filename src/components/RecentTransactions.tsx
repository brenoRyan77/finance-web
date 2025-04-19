
import { useState } from 'react';
import {ExpenseVO} from '@/types';
import TransactionItem from './TransactionItem';
import ExpenseForm from './ExpenseForm';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { Plus } from 'lucide-react';
import TransactionDetails from "@/components/TransactionDetails.tsx";

interface RecentTransactionsProps {
  expenses: ExpenseVO[];
  onAddExpense: (expense: ExpenseVO) => void;
  onDeleteExpense?: (id: string) => void;
  onEditExpense?: (expense: ExpenseVO) => void;
}

const RecentTransactions = ({ expenses, onAddExpense, onDeleteExpense, onEditExpense }: RecentTransactionsProps) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<ExpenseVO | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const displayLimit = expanded ? expenses.length : 5;
  
  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const displayedExpenses = sortedExpenses.slice(0, displayLimit);
  
  const handleAddExpense = (expense: ExpenseVO) => {
    onAddExpense(expense);
    toast({
      title: "Despesa adicionada",
      description: `${expense.description} - ${formatCurrency(expense.amount)}`,
    });
  };

  const handleEditExpense = (expense: ExpenseVO) => {
    if (onEditExpense) {
      onEditExpense(expense);
      setShowDetails(false);
      toast({
        title: "Despesa atualizada",
        description: `${expense.description} - ${formatCurrency(expense.amount)}`,
      });
    }
  };

  const handleTransactionClick = (transaction: ExpenseVO) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };
  
  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Transações Recentes</h3>
        <ExpenseForm onSubmit={handleAddExpense}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Nova</span>
          </Button>
        </ExpenseForm>
      </div>
      
      {displayedExpenses.length > 0 ? (
        <div className="space-y-1 mb-3">
          {displayedExpenses.map((expense) => (
            <TransactionItem 
              key={expense.id} 
              transaction={expense}
              onClick={() => handleTransactionClick(expense)}
              onDelete={onDeleteExpense}
              showDetailsInline={false} // Set to false to prevent duplicate modals
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <p>Nenhuma transação registrada.</p>
          <p className="text-sm mt-2">Adicione sua primeira despesa clicando no botão acima.</p>
        </div>
      )}
      
      {expenses.length > 5 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Ver menos" : `Ver mais ${expenses.length - 5} transações`}
        </Button>
      )}

      {selectedTransaction && (
          <TransactionDetails
              transaction={selectedTransaction}
              isOpen={showDetails}
              onClose={() => setShowDetails(false)}
              onEdit={onEditExpense ? handleEditExpense : undefined}
          />
      )}
    </div>
  );
};

export default RecentTransactions;
