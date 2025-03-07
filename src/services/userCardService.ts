import { apiClient } from "@/services/apiClient.ts";
import {CardDetails} from "@/types";

const baseUrl = '/user-card'

export const fetchCardWithExpenses = async (year: number, month: number): Promise<CardDetails[]> => {
    return apiClient.get<CardDetails[]>(`${baseUrl}/user?year=${year}&month=${month}`);
}