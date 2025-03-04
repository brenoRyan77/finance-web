
import { FinancialAdvice } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Lightbulb, TrendingUp, PiggyBank } from 'lucide-react';

interface FinancialAdviceCardProps {
  advice: FinancialAdvice;
}

const FinancialAdviceCard = ({ advice }: FinancialAdviceCardProps) => {
  const getPriorityColor = () => {
    switch (advice.priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getPriorityIcon = () => {
    switch (advice.priority) {
      case 'high':
        return <PiggyBank className="h-5 w-5" />;
      case 'medium':
        return <TrendingUp className="h-5 w-5" />;
      case 'low':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  return (
    <div className={cn(
      "rounded-xl p-4 border transition-all duration-300",
      "hover:shadow-sm flex flex-col gap-3",
      getPriorityColor()
    )}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/80 dark:bg-black/20 p-1.5 flex-shrink-0">
            {getPriorityIcon()}
          </div>
          <h3 className="font-medium">{advice.title}</h3>
        </div>
        <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20">
          {advice.priority === 'high' ? 'Alta' : advice.priority === 'medium' ? 'Média' : 'Baixa'}
        </div>
      </div>
      
      <p className="text-sm opacity-90">{advice.description}</p>
      
      {advice.savingsAmount && (
        <div className="text-sm">
          <span className="font-medium">Valor sugerido:</span> {formatCurrency(advice.savingsAmount)}
        </div>
      )}
      
      {advice.investmentSuggestion && (
        <div className="text-sm">
          <span className="font-medium">Sugestão:</span> {advice.investmentSuggestion}
        </div>
      )}
      
      <Button 
        variant="ghost" 
        className="self-end mt-2 text-sm p-0 hover:bg-transparent hover:underline"
      >
        <span>Saiba mais</span>
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default FinancialAdviceCard;
