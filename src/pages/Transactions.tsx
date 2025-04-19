
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import RecentTransactions from '@/components/RecentTransactions';
import { Button } from '@/components/ui/button';
import ExpenseForm from '@/components/ExpenseForm';
import {ExpenseVO} from '@/types';
import { formatCurrency, formatMonthYear } from '@/utils/formatters';
import { PlusCircle } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { addMonths, subMonths, format } from 'date-fns';
import {create, getAll} from "@/services/expenseService.ts";

const Transactions = () => {
  const [expenses, setExpenses] = useState<ExpenseVO[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseVO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableMonths, setAvailableMonths] = useState<Date[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadExpenses = async () => {
      setIsLoading(true);
      try{
        const response = await getAll(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
        setExpenses(response)
      } catch (error){
        console.error(error)
      }finally {
        setIsLoading(false)
      }
    };
    loadExpenses();
    extractAvailableMonths(expenses);
  }, [selectedDate]);

  useEffect(() => {
    if (!isLoading) {
      filterExpensesByMonth(selectedDate);
    }
  }, [expenses, selectedDate]);

  const extractAvailableMonths = (expenses: ExpenseVO[]) => {
    const months = new Set<string>();
    
    months.add(format(new Date(), 'yyyy-MM'));
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = format(date, 'yyyy-MM');
      months.add(monthYear);
    });
    
    const sortedMonths = Array.from(months)
      .map(monthStr => {
        const [year, month] = monthStr.split('-').map(Number);
        return new Date(year, month - 1, 1);
      })
      .sort((a, b) => b.getTime() - a.getTime()); // Sort descending
    
    setAvailableMonths(sortedMonths);
  };

  const filterExpensesByMonth = (date: Date) => {
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === date.getMonth() &&
        expenseDate.getFullYear() === date.getFullYear()
      );
    });
    setFilteredExpenses(filtered);
  };

  const handleAddExpense = async (expense: ExpenseVO) => {
    try {
      await create(expense);

      const updatedExpenses = await getAll(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
      setExpenses(updatedExpenses);

      extractAvailableMonths(updatedExpenses);

      toast({
        title: "Despesa adicionada",
        description: `${expense.description} - ${formatCurrency(expense.amount)}`,
      });

    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      toast({
        title: "Erro ao adicionar despesa",
        description: "Não foi possível salvar a despesa. Tente novamente.",
        variant: "destructive",
      });
    }
  };


  const handleMonthChange = (monthYearStr: string) => {
    const [year, month] = monthYearStr.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const handlePreviousMonth = () => {
    setSelectedDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => addMonths(prev, 1));
  };

  const handleEditExpense = (updatedExpense: ExpenseVO) => {
    const updatedExpenses = expenses.map(expense =>
        expense.id === updatedExpense.id ? updatedExpense : expense
    );

    setExpenses(updatedExpenses);

    toast({
      title: "Despesa atualizada",
      description: `${updatedExpense.description} - ${formatCurrency(updatedExpense.amount)}`,
    });
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);

    toast({
      title: "Despesa excluída",
      description: "A despesa foi excluída com sucesso",
    });

    extractAvailableMonths(updatedExpenses);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-14">
        {/* Page Title and Action Buttons */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Transações</h1>
            <p className="text-muted-foreground">Gerencie suas receitas e despesas</p>
          </div>
          <ExpenseForm onSubmit={handleAddExpense}>
            <Button className="mt-2 sm:mt-0 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Nova Despesa</span>
            </Button>
          </ExpenseForm>
        </div>
        
        {/* Month Filter */}
        <div className="flex gap-2 mb-6 items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePreviousMonth}
            aria-label="Mês anterior"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </Button>
          
          <Select
            value={format(selectedDate, 'yyyy-MM')}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue>{formatMonthYear(selectedDate)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map(date => (
                <SelectItem 
                  key={format(date, 'yyyy-MM')} 
                  value={format(date, 'yyyy-MM')}
                >
                  {formatMonthYear(date)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextMonth}
            aria-label="Próximo mês"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </Button>
        </div>
        
        {/* Transactions List */}
        <RecentTransactions 
          expenses={filteredExpenses} 
          onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
        />
      </main>
    </div>
  );
};

export default Transactions;
