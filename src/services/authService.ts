import { apiClient } from "@/services/apiClient.ts";
import {LoginRequest, LoginResponse} from "@/types";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
};