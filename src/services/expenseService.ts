import { apiClient } from "@/services/apiClient.ts";
import {ExpenseVO, MonthlyData} from "@/types";

export const create = async(newExpense: Omit<ExpenseVO, 'id'>): Promise<ExpenseVO> => {
    return apiClient.post<ExpenseVO>('/expenses', newExpense);
}

export const getAll = async(year: number, month: number): Promise<ExpenseVO[]> => {
    return apiClient.get<ExpenseVO[]>(`/expenses?year=${year}&month=${month}`);
}

export const getMonthlySummary = async(year: number, month: number): Promise<MonthlyData> => {
    return apiClient.get<MonthlyData>(`/expenses/summary?year=${year}&month=${month}`);
}