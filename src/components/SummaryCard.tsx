
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { ArrowDown, ArrowUp, DollarSign, Wallet } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  description?: string;
  icon?: 'income' | 'expense' | 'balance' | 'savings-rate';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'income' | 'expense' | 'balance' | 'savings-rate';
  isPercentage?: boolean;
}

const SummaryCard = ({
  title,
  amount,
  description,
  icon = 'balance',
  trend,
  variant = 'default',
  isPercentage = false,
}: SummaryCardProps) => {
  const iconMap = {
    income: <ArrowUp className="h-5 w-5" />,
    expense: <ArrowDown className="h-5 w-5" />,
    balance: <Wallet className="h-5 w-5" />,
    'savings-rate': <DollarSign className="h-5 w-5" />,
  };

  const variantStyles = {
    default: 'bg-card text-card-foreground',
    income: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 text-green-900 dark:text-green-50',
    expense: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 text-red-900 dark:text-red-50',
    balance: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 text-blue-900 dark:text-blue-50',
    'savings-rate': 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 text-purple-900 dark:text-purple-50',
  };

  return (
    <div className={cn(
      "rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-4",
      "border border-border/40 backdrop-blur-sm",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium opacity-80">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold tracking-tight">
              {isPercentage ? formatPercentage(amount) : formatCurrency(amount)}
            </p>
            {trend && (
              <span className={cn(
                "ml-2 text-xs font-medium flex items-center",
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {trend.isPositive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                {formatPercentage(Math.abs(trend.value))}
              </span>
            )}
          </div>
          {description && <p className="mt-1 text-xs opacity-70">{description}</p>}
        </div>
        <div className={cn(
          "rounded-full p-2.5",
          variant === 'default' ? "bg-primary/10 text-primary" : "bg-white/20 text-inherit"
        )}>
          {iconMap[icon]}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
