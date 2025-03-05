
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import SummaryCard from '@/components/SummaryCard';
import ExpensesByCategory from '@/components/ExpensesByCategory';
import ExpensesByCard from '@/components/ExpensesByCard';
import MonthlyTrendChart from '@/components/MonthlyTrendChart';
import RecentTransactions from '@/components/RecentTransactions';
import FinancialAdviceCard from '@/components/FinancialAdviceCard';
import ExpenseForm from '@/components/ExpenseForm';
import {Expense, ExpenseVO} from '@/types';
import { formatCurrency, getCurrentMonthYear } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { 
  fetchExpenses, 
  fetchFinancialAdvice, 
  fetchSummary,
  addExpense as apiAddExpense
} from '@/services/api';
import { create } from "@/services/expenseService.ts";

const Index = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Obter dados usando react-query
  const { 
    data: expenses = [],
    isLoading: isLoadingExpenses
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses
  });
  
  const { 
    data: financialAdviceData = [], 
    isLoading: isLoadingAdvice 
  } = useQuery({
    queryKey: ['financialAdvice'],
    queryFn: fetchFinancialAdvice
  });
  
  const { 
    data: summary, 
    isLoading: isLoadingSummary 
  } = useQuery({
    queryKey: ['summary'],
    queryFn: fetchSummary
  });

  const apiAddExpense = async (newExpense: ExpenseVO) => {
    return create(newExpense); // Chama a função create que envia os dados ao backend
  };
  
  // Mutation para adicionar despesa
  const addExpenseMutation = useMutation({
    mutationFn: apiAddExpense,
    onSuccess: () => {
      // Invalidar queries para recarregar os dados
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    }
  });
  
  const handleAddExpense = (expense: Omit<ExpenseVO, 'id'>) => {
    addExpenseMutation.mutate(expense, {
      onSuccess: (newExpense) => {
        toast({
          title: "Despesa adicionada",
          description: `${newExpense.description} - ${formatCurrency(newExpense.amount)}`,
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao adicionar despesa",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };
  
  const isLoading = isLoadingExpenses || isLoadingAdvice || isLoadingSummary;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-14">
        {/* Page Title and Action Button */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">{getCurrentMonthYear()}</p>
          </div>
          <ExpenseForm onSubmit={handleAddExpense}>
            <Button className="mt-2 sm:mt-0 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Nova Despesa</span>
            </Button>
          </ExpenseForm>
        </div>
        
        {/* Summary Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-card/50 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard 
              title="Receita Mensal" 
              amount={summary.totalIncome}
              description="Entrada fixa mensal"
              icon="income"
              variant="income"
            />
            <SummaryCard 
              title="Despesas" 
              amount={summary.totalExpenses}
              description={`${expenses.length} transações`}
              icon="expense"
              variant="expense"
            />
            <SummaryCard 
              title="Saldo" 
              amount={summary.balance}
              description="Disponível para economizar ou investir"
              icon="balance"
              variant="balance"
            />
            <SummaryCard 
              title="Taxa de Poupança" 
              amount={summary.savingsRate}
              description="Percentual da receita economizado"
              icon="savings-rate"
              variant="savings-rate"
              isPercentage
            />
          </div>
        ) : null}
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <MonthlyTrendChart />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <ExpensesByCategory expenses={expenses} />
            <ExpensesByCard expenses={expenses} />
          </div>
        </div>
        
        {/* Transactions and Advice */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentTransactions 
              expenses={expenses} 
              onAddExpense={handleAddExpense} 
              isLoading={isLoadingExpenses}
            />
          </div>
          <div>
            <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card">
              <h3 className="font-medium mb-4">Sugestões Financeiras</h3>
              {isLoadingAdvice ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-background/50 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {financialAdviceData.map((advice) => (
                    <FinancialAdviceCard key={advice.id} advice={advice} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
