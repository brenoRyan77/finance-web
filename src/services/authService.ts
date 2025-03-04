import { apiUrl } from '@/config';
import {LoginRequest, LoginResponse} from "@/types";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    return response.json();
};