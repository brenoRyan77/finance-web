export type CardType = 'nubank' | 'itau' | 'banco-brasil' | 'inter' | 'cash' | 'bradesco' | 'caiax' | 'neon' | 'picpay' | 'santander';

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
    id?: number;
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
    hasCards: boolean;
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

export interface UserVO {
    id: number;
    name: string;
    email: string;
    login: string;
    password?: string;
    userCards?: UserCardVO[];
}

export interface UserCardVO {
    id?: number;
    closingDay: number;
    dueDay: number;
    card: Partial<CardInfo>;
}

export interface MonthlyData {
    income: number;
    totalExpenses: number;
    expenses: ExpenseVO[];
}

export interface InitialSetup {
    userId: number;
    userCards: UserCardVO[];
    income: Partial<Income>;
}

export interface MonthlyTrend {
    label: string;
    totalIncome: number;
    totalExpense: number;
}

