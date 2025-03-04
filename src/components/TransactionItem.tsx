
import { Expense } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { categories } from '@/data/mockData';
import { cards } from '@/data/mockData';
import { CreditCard, Banknote, CalendarClock, BadgeDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Expense;
  onClick?: () => void;
}

const TransactionItem = ({ transaction, onClick }: TransactionItemProps) => {
  // Find category for the transaction
  const category = categories.find(cat => cat.id === transaction.category);
  
  // Find card for the transaction
  const card = cards.find(c => c.type === transaction.cardType);
  
  // Determine icon based on payment method
  const getPaymentIcon = () => {
    switch (transaction.paymentMethod) {
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'installment':
        return <CalendarClock className="h-4 w-4" />;
      case 'one-time':
        return transaction.cardType === 'cash' 
          ? <Banknote className="h-4 w-4" /> 
          : <CreditCard className="h-4 w-4" />;
      default:
        return <BadgeDollarSign className="h-4 w-4" />;
    }
  };

  // Format installment text if applicable
  const getInstallmentText = () => {
    if (transaction.paymentMethod === 'installment' && transaction.installments && transaction.currentInstallment) {
      return ` (${transaction.currentInstallment}/${transaction.installments})`;
    }
    return '';
  };

  return (
    <div 
      className={cn(
        "group flex items-center justify-between p-3 rounded-lg transition-all duration-200",
        "hover:bg-primary/5 cursor-pointer border border-transparent hover:border-border/50"
      )}
      onClick={onClick}
    >
      {/* Left side: Category icon and transaction details */}
      <div className="flex items-center space-x-3">
        {/* Category circle */}
        <div 
          className="rounded-full p-2.5 flex-shrink-0" 
          style={{ backgroundColor: category?.color + '33', color: category?.color }}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" className="fill-current" />
            <path d="M14.5 9h-5l-1 6h7l-1-6z" fill="white" />
          </svg>
        </div>
        
        {/* Transaction info */}
        <div>
          <p className="font-medium text-foreground">{transaction.description}</p>
          <div className="text-xs text-muted-foreground flex items-center mt-0.5">
            <span>{formatDate(transaction.date)}</span>
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
      <div className="text-right">
        <p className="font-medium text-destructive">
          -{formatCurrency(transaction.amount)}
        </p>
        {category && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {category.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
