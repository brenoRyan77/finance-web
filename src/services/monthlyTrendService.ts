import { apiClient } from '@/services/apiClient.ts';
import {MonthlyTrend} from "@/types";

const baseUrl = '/monthly-trends';

export const getMonthlyTrend = async (): Promise<MonthlyTrend[]> => {
  return apiClient.get<MonthlyTrend[]>(`${baseUrl}`);
};