import { apiClient } from "@/services/apiClient.ts";
import {UserVO} from "@/types";

const baseUrl = '/users';

export const getUserByLogin = async (login: string): Promise<UserVO> => {
    return apiClient.get<UserVO>(`${baseUrl}/login/${login}`);
}

export const createUser = async (user: Partial<UserVO>): Promise<UserVO> => {
    return apiClient.post<UserVO>(`${baseUrl}`, user);
}

export const updateUser = async (user: UserVO): Promise<UserVO> => {
    return apiClient.put<UserVO>(`${baseUrl}`, user);
}