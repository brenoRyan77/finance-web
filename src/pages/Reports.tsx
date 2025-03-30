
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ExpensesByCategory from '@/components/ExpensesByCategory';
import ExpensesByCard from '@/components/ExpensesByCard';
import MonthlyTrendChart from '@/components/MonthlyTrendChart';
import { Button } from '@/components/ui/button';
import {ExpenseVO, Income} from '@/types';
import { addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { formatMonthYear, formatCurrency } from '@/utils/formatters';
import {getAll, getMonthlySummary} from "@/services/expenseService.ts";
import { useToast} from "@/hooks/use-toast.ts";
import {getLastIncome} from "@/services/incomeService.ts";

const Reports = () => {
  const [expenses, setExpenses] = useState<ExpenseVO[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseVO[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [incomes, setIncomes] = useState<Income | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [expensesResponse, incomeResponse] = await Promise.all([
          getAll(selectedDate.getFullYear(), selectedDate.getMonth() + 1),
          getLastIncome(),
        ]);
        setExpenses(expensesResponse);
        setIncomes(incomeResponse);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedDate]);

  useEffect(() => {
    if (!isLoading) {
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      
      const filtered = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });
      
      setFilteredExpenses(filtered);
    }
  }, [expenses, selectedDate, isLoading]);

  const handlePreviousMonth = () => {
    setSelectedDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => addMonths(prev, 1));
  };

  const calculateMonthlySummary = () => {
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomes?.amount || 0; // Assuming the last income is the monthly income
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
    
    return {
      totalExpenses,
      totalIncome,
      balance,
      savingsRate,
    };
  };

  const summary = calculateMonthlySummary();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-14">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Análise de despesas e receitas</p>
        </div>
        
        {/* Month Selector */}
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePreviousMonth}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
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
              <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </Button>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Income Card */}
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-sm font-medium">Receita Mensal</div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalIncome)}</div>
            <div className="text-sm text-muted-foreground mt-1">Entrada fixa mensal</div>
          </div>
          
          {/* Expenses Card */}
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-sm font-medium">Despesas</div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</div>
            <div className="text-sm text-muted-foreground mt-1">{filteredExpenses.length} transações</div>
          </div>
          
          {/* Balance Card */}
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-sm font-medium">Saldo</div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(summary.balance)}</div>
            <div className="text-sm text-muted-foreground mt-1">Disponível para economizar ou investir</div>
          </div>
          
          {/* Savings Rate Card */}
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-sm font-medium">Taxa de Poupança</div>
            </div>
            <div className="text-2xl font-bold">{summary.savingsRate.toFixed(2)}%</div>
            <div className="text-sm text-muted-foreground mt-1">Percentual da receita economizado</div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ExpensesByCategory expenses={filteredExpenses} />
          <ExpensesByCard expenses={filteredExpenses} />
        </div>
        
        {/* Monthly Trend */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card mb-6">
          <h3 className="font-medium mb-4">Tendência Mensal</h3>
          <div className="h-[300px]">
            <MonthlyTrendChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
