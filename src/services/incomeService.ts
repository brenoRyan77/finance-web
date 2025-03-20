import {apiClient} from "@/services/apiClient.ts";
import {Income, InitialSetup} from "@/types";

const baseUrl = '/incomes'

export const getInitialSetup = async (): Promise<InitialSetup> => {
    return apiClient.get<InitialSetup>(`${baseUrl}/initial-setup`);
}

export const getLastIncome = async (): Promise<Income> => {
    return apiClient.get<Income>(`${baseUrl}/last`);
}