import { apiClient } from "@/services/apiClient.ts";
import {CardInfo} from "@/types";

export const fetchCardsByUser = async(): Promise<CardInfo[]> => {
    return apiClient.get<CardInfo[]>('/cards/user');
}

export const fetchCards = async(): Promise<CardInfo[]> => {
    return apiClient.get<CardInfo[]>('/cards');
}