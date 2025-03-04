
import { CardInfo, Category, Expense, Income, FinancialAdvice } from '@/types';
import { addDays, subDays, startOfMonth, format } from 'date-fns';

// Categories
export const categories: Category[] = [
  { id: '1', name: 'Alimentação', icon: 'utensils', color: '#FF6B6B' },
  { id: '2', name: 'Transporte', icon: 'car', color: '#4ECDC4' },
  { id: '3', name: 'Moradia', icon: 'home', color: '#45B7D1' },
  { id: '4', name: 'Lazer', icon: 'film', color: '#F9C74F' },
  { id: '5', name: 'Saúde', icon: 'heart-pulse', color: '#FF9F1C' },
  { id: '6', name: 'Educação', icon: 'book', color: '#A06CD5' },
  { id: '7', name: 'Compras', icon: 'shopping-bag', color: '#FF8FA3' },
  { id: '8', name: 'Assinaturas', icon: 'credit-card', color: '#4EA8DE' },
  { id: '9', name: 'Outros', icon: 'more-horizontal', color: '#99A1A6' },
];

// Cards Information
export const cards: CardInfo[] = [
  { 
    type: 'nubank', 
    name: 'Nubank', 
    color: '#8a05be', 
    icon: 'credit-card',
    closingDay: 3,
    dueDay: 10
  },
  { 
    type: 'itau', 
    name: 'Itaú', 
    color: '#ec7000', 
    icon: 'credit-card',
    closingDay: 5,
    dueDay: 12
  },
  { 
    type: 'banco-brasil', 
    name: 'Banco do Brasil', 
    color: '#ffef38', 
    icon: 'credit-card',
    closingDay: 10,
    dueDay: 15
  },
  { 
    type: 'inter', 
    name: 'Inter', 
    color: '#ff7a00', 
    icon: 'credit-card',
    closingDay: 15,
    dueDay: 22
  },
  { 
    type: 'cash', 
    name: 'Dinheiro', 
    color: '#4cd964', 
    icon: 'wallet'
  }
];

// Mock income
export const incomes: Income[] = [
  {
    id: '1',
    description: 'Salário',
    amount: 4750,
    date: new Date(),
    recurring: true
  }
];

// Mock expenses
const currentDate = new Date();
const startOfCurrentMonth = startOfMonth(currentDate);

export const expenses: Expense[] = [
  {
    id: '1',
    description: 'Supermercado',
    amount: 350.75,
    date: subDays(currentDate, 5),
    category: '1',
    cardType: 'nubank',
    paymentMethod: 'one-time',
  },
  {
    id: '2',
    description: 'Netflix',
    amount: 39.90,
    date: subDays(currentDate, 12),
    category: '8',
    cardType: 'itau',
    paymentMethod: 'one-time',
  },
  {
    id: '3',
    description: 'Combustível',
    amount: 120,
    date: subDays(currentDate, 3),
    category: '2',
    cardType: 'banco-brasil',
    paymentMethod: 'one-time',
  },
  {
    id: '4',
    description: 'Celular - Parcela 3/12',
    amount: 208.33,
    date: subDays(currentDate, 15),
    category: '7',
    cardType: 'inter',
    paymentMethod: 'installment',
    installments: 12,
    currentInstallment: 3,
  },
  {
    id: '5',
    description: 'Almoço',
    amount: 25.90,
    date: subDays(currentDate, 1),
    category: '1',
    cardType: 'cash',
    paymentMethod: 'cash',
  },
  {
    id: '6',
    description: 'Internet',
    amount: 109.90,
    date: subDays(currentDate, 10),
    category: '8',
    cardType: 'nubank',
    paymentMethod: 'one-time',
  },
  {
    id: '7',
    description: 'Curso de Inglês',
    amount: 299,
    date: subDays(currentDate, 8),
    category: '6',
    cardType: 'itau',
    paymentMethod: 'one-time',
  },
  {
    id: '8',
    description: 'Farmácia',
    amount: 87.42,
    date: subDays(currentDate, 4),
    category: '5',
    cardType: 'banco-brasil',
    paymentMethod: 'one-time',
  },
  {
    id: '9',
    description: 'Show',
    amount: 180,
    date: subDays(currentDate, 2),
    category: '4',
    cardType: 'inter',
    paymentMethod: 'one-time',
  },
  {
    id: '10',
    description: 'Aluguel',
    amount: 1200,
    date: addDays(startOfCurrentMonth, 5),
    category: '3',
    cardType: 'cash',
    paymentMethod: 'cash',
  },
];

// Financial advice
export const financialAdvice: FinancialAdvice[] = [
  {
    id: '1',
    title: 'Poupança de Emergência',
    description: 'Economize R$950 para completar 6 meses de gastos essenciais em sua poupança de emergência.',
    savingsAmount: 950,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Investimento em Renda Fixa',
    description: 'Considere investir R$500 mensais em um CDB com liquidez diária para começar a construir seu patrimônio.',
    investmentSuggestion: 'CDB com liquidez diária',
    savingsAmount: 500,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Pague dívidas de alto juros',
    description: 'Priorize o pagamento de dívidas com taxas de juros acima de 12% ao ano antes de fazer novos investimentos.',
    priority: 'high',
  },
  {
    id: '4',
    title: 'Diversifique Investimentos',
    description: 'Com o excedente mensal, considere diversificar em fundos imobiliários (FIIs) para renda passiva.',
    investmentSuggestion: 'Fundos Imobiliários (FIIs)',
    priority: 'low',
  },
];

// Generate chart data
export const generateCategoryData = () => {
  const categoryTotals: { [key: string]: number } = {};
  
  expenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });
  
  return {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: categories.map(cat => categoryTotals[cat.id] || 0),
        backgroundColor: categories.map(cat => cat.color),
      },
    ],
  };
};

export const generateCardData = () => {
  const cardTotals: { [key: string]: number } = {};
  
  expenses.forEach(expense => {
    if (!cardTotals[expense.cardType]) {
      cardTotals[expense.cardType] = 0;
    }
    cardTotals[expense.cardType] += expense.amount;
  });
  
  return {
    labels: cards.map(card => card.name),
    datasets: [
      {
        label: 'Gastos por Cartão',
        data: cards.map(card => cardTotals[card.type] || 0),
        backgroundColor: cards.map(card => card.color),
      },
    ],
  };
};

export const generateMonthlyData = () => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentMonth = new Date().getMonth();
  
  // Mock data for the last 6 months
  const expensesData = [2850, 3100, 2790, 3200, 2950, 2730];
  const incomeData = Array(6).fill(4750); // Fixed income of 4750
  
  return {
    labels: months.slice(currentMonth - 5, currentMonth + 1),
    datasets: [
      {
        label: 'Receitas',
        data: incomeData,
        backgroundColor: 'rgba(76, 217, 100, 0.2)',
        borderColor: 'rgba(76, 217, 100, 1)',
        borderWidth: 2,
      },
      {
        label: 'Despesas',
        data: expensesData,
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
        borderColor: 'rgba(255, 59, 48, 1)',
        borderWidth: 2,
      },
    ],
  };
};

export const getMonthlySummary = () => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = (balance / totalIncome) * 100;
  
  return {
    totalExpenses,
    totalIncome,
    balance,
    savingsRate,
    month: format(currentDate, 'MMMM'),
    year: currentDate.getFullYear(),
  };
};
