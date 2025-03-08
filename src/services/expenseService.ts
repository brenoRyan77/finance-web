import { apiClient } from "@/services/apiClient.ts";
import {ExpenseVO} from "@/types";

export const create = async(newExpense: Omit<ExpenseVO, 'id'>): Promise<ExpenseVO> => {
    return apiClient.post<ExpenseVO>('/expenses', newExpense);
}

export const getAll = async(year: number, month: number): Promise<ExpenseVO[]> => {
    return apiClient.get<ExpenseVO[]>(`/expenses?year=${year}&month=${month}`);
}