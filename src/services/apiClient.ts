import { apiUrl } from "@/config.ts";

class ApiClient {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = sessionStorage.getItem('token');

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
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                window.location.href = '/login';
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorResponse = await response.json();
                throw new Error(JSON.stringify(errorResponse));
            }

            throw new Error('Erro na requisição');
        }

        if (response.status === 204) {
            return null as T; // ou {} as T se precisar evitar null
        }

        // Verifica se a resposta tem um corpo antes de tentar fazer response.json()
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }


        return {} as T;
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