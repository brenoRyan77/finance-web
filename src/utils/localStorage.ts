
import { Expense, Income, MonthlyBudget } from '@/types';

const STORAGE_KEYS = {
  EXPENSES: 'finance-manager-expenses',
  INCOMES: 'finance-manager-incomes',
  MONTHLY_BUDGETS: 'finance-manager-monthly-budgets',
  SETTINGS: 'finance-manager-settings',
};

// Expenses
export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses to localStorage:', error);
  }
};

export const getExpenses = (): Expense[] => {
  try {
    const expenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!expenses) return [];
    
    // Parse the JSON and convert date strings back to Date objects
    return JSON.parse(expenses, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    });
  } catch (error) {
    console.error('Error retrieving expenses from localStorage:', error);
    return [];
  }
};

// Incomes
export const saveIncomes = (incomes: Income[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
  } catch (error) {
    console.error('Error saving incomes to localStorage:', error);
  }
};

export const getIncomes = (): Income[] => {
  try {
    const incomes = localStorage.getItem(STORAGE_KEYS.INCOMES);
    if (!incomes) return [];
    
    // Parse the JSON and convert date strings back to Date objects
    return JSON.parse(incomes, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    });
  } catch (error) {
    console.error('Error retrieving incomes from localStorage:', error);
    return [];
  }
};

// Monthly Budgets
export const saveMonthlyBudgets = (budgets: MonthlyBudget[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MONTHLY_BUDGETS, JSON.stringify(budgets));
  } catch (error) {
    console.error('Error saving monthly budgets to localStorage:', error);
  }
};

export const getMonthlyBudgets = (): MonthlyBudget[] => {
  try {
    const budgets = localStorage.getItem(STORAGE_KEYS.MONTHLY_BUDGETS);
    if (!budgets) return [];
    
    return JSON.parse(budgets, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    });
  } catch (error) {
    console.error('Error retrieving monthly budgets from localStorage:', error);
    return [];
  }
};

// Settings
interface Settings {
  fixedIncome: number;
  [key: string]: any;
}

export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};

export const getSettings = (): Settings => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!settings) return { fixedIncome: 4750 }; // Default settings
    
    return JSON.parse(settings);
  } catch (error) {
    console.error('Error retrieving settings from localStorage:', error);
    return { fixedIncome: 4750 };
  }
};

// Clear all data
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.INCOMES);
    localStorage.removeItem(STORAGE_KEYS.MONTHLY_BUDGETS);
    // Don't clear settings by default
  } catch (error) {
    console.error('Error clearing data from localStorage:', error);
  }
};
