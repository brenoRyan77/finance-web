import { apiUrl } from "@/config.ts";

class ApiClient {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = localStorage.getItem('token');

        const headers = new Headers(options.headers || {});
        headers.set('Content-Type', 'application/json');

        if (token && endpoint !== '/auth/login') {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(`${apiUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Erro na requisição');
        }

        return response.json();
    }

    get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();