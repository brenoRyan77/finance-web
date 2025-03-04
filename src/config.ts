const getApiUrl = () => {
    const env = import.meta.env.MODE;

    switch (env) {
        case 'development':
            return import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
        case 'production':
            return import.meta.env.VITE_API_URL || 'https://minhaapi.com/api';
        case 'test':
            return 'http://localhost:3000';
        default:
            return 'http://localhost:3000';
    }
}

export const apiUrl = getApiUrl();