export type CardType = 'nubank' | 'itau' | 'banco-brasil' | 'inter' | 'cash';

export type PaymentMethod = 'cash' | 'one-time' | 'installment';

export interface Expense {
    id: string;
    description: string;
    amount: number;
    date: Date;
    category: string;
    cardType: CardType;
    paymentMethod: PaymentMethod;
    installments?: number;
    currentInstallment?: number;
    tags?: string[];
    notes?: string;
    userCardId?: number;
}

export interface Income {
    id: string;
    description: string;
    amount: number;
    date: Date;
    recurring: boolean;
    notes?: string;
}

export interface MonthlyBudget {
    month: number;
    year: number;
    income: number;
    expenses: Expense[];
    savings?: number;
    investment?: number;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface CardInfo {
    userCardId?: number;
    type: CardType;
    name: string;
    color: string;
    icon: string;
    closingDay?: number;
    dueDay?: number;
}

export interface FinancialAdvice {
    id: string;
    title: string;
    description: string;
    savingsAmount?: number;
    investmentSuggestion?: string;
    priority: 'low' | 'medium' | 'high';
}

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
    }[];
}

export interface LoginRequest {
    login: string;
    password: string;
}

export interface LoginResponse {
    username: string;
    authenticated: boolean;
    created: Date;
    expiration: Date;
    accessToken: string;
    refreshToken: string;
}

export interface ExpenseVO {
    id?: string;
    description: string;
    amount: number;
    date: Date;
    categoryId: string;
    paymentMethod: PaymentMethod;
    installments?: number;
    currentInstallment?: number;
    observation?: string;
    userCardId?: number;
    category?: CategoryVO;
    card?: CardVO;
}

export interface CardDetails {
    id: number;
    userCardId: number;
    type: CardType;
    name: string;
    color: string;
    icon: string;
    closingDay: number;
    dueDay: number;
    totalAmount: number;
    expenseVOS: ExpenseVO[];
}

export interface CategoryVO {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface CardVO {
    id: number;
    type: CardType;
    name: string;
    color: string;
    icon: string;
}
