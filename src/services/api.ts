
import { CardInfo, Category, Expense, FinancialAdvice, Income } from '@/types';

const API_URL = 'http://localhost:3000';

export interface Summary {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  savingsRate: number;
  month: string;
  year: number;
}

// Funções para buscar dados da API
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error('Erro ao buscar categorias');
  }
  return response.json();
};

export const fetchCards = async (): Promise<CardInfo[]> => {
  const response = await fetch(`${API_URL}/cards`);
  if (!response.ok) {
    throw new Error('Erro ao buscar cartões');
  }
  return response.json();
};

export const fetchIncomes = async (): Promise<Income[]> => {
  const response = await fetch(`${API_URL}/incomes`);
  if (!response.ok) {
    throw new Error('Erro ao buscar receitas');
  }
  const incomes = await response.json();
  // Converter strings de data para objetos Date
  return incomes.map((income: any) => ({
    ...income,
    date: new Date(income.date)
  }));
};

export const fetchExpenses = async (): Promise<Expense[]> => {
  const response = await fetch(`${API_URL}/expenses`);
  if (!response.ok) {
    throw new Error('Erro ao buscar despesas');
  }
  const expenses = await response.json();
  // Converter strings de data para objetos Date
  return expenses.map((expense: any) => ({
    ...expense,
    date: new Date(expense.date)
  }));
};

export const fetchFinancialAdvice = async (): Promise<FinancialAdvice[]> => {
  const response = await fetch(`${API_URL}/financialAdvice`);
  if (!response.ok) {
    throw new Error('Erro ao buscar conselhos financeiros');
  }
  return response.json();
};

export const fetchSummary = async (): Promise<Summary> => {
  const response = await fetch(`${API_URL}/summary`);
  if (!response.ok) {
    throw new Error('Erro ao buscar resumo financeiro');
  }
  return response.json();
};

// Funções para adicionar dados
export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  const response = await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...expense,
      id: crypto.randomUUID(),
      date: expense.date.toISOString(),
    }),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao adicionar despesa');
  }
  
  const newExpense = await response.json();
  return {
    ...newExpense,
    date: new Date(newExpense.date),
  };
};

export const updateExpense = async (expense: Expense): Promise<Expense> => {
  const response = await fetch(`${API_URL}/expenses/${expense.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...expense,
      date: expense.date.toISOString(),
    }),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao atualizar despesa');
  }
  
  const updatedExpense = await response.json();
  return {
    ...updatedExpense,
    date: new Date(updatedExpense.date),
  };
};

export const deleteExpense = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Erro ao excluir despesa');
  }
};

// Funções semelhantes para receitas
export const addIncome = async (income: Omit<Income, 'id'>): Promise<Income> => {
  const response = await fetch(`${API_URL}/incomes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...income,
      id: crypto.randomUUID(),
      date: income.date.toISOString(),
    }),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao adicionar receita');
  }
  
  const newIncome = await response.json();
  return {
    ...newIncome,
    date: new Date(newIncome.date),
  };
};
