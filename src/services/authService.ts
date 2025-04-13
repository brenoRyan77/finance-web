import { apiClient } from "@/services/apiClient.ts";
import {LoginRequest, LoginResponse} from "@/types";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
};

export const logout = async (): Promise<void> => {
    return apiClient.post('/auth/logout');
};