
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('API Client Initialized with URL:', API_URL);

interface RequestOptions extends RequestInit {
    token?: string;
}

export const apiClient = {
    async get(endpoint: string, options: RequestOptions = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    async post(endpoint: string, body: any, options: RequestOptions = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
        });
    },

    async patch(endpoint: string, body: any, options: RequestOptions = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
            },
        });
    },

    async delete(endpoint: string, options: RequestOptions = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    },

    async request(endpoint: string, options: RequestOptions = {}) {
        const url = `${API_URL}${endpoint}`;
        const headers = new Headers(options.headers);

        if (options.token) {
            headers.set('Authorization', `Bearer ${options.token}`);
        }

        try {
            console.log(`Fetching: ${url}`);
            const response = await fetch(url, { ...options, headers });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`API Error (${response.status}):`, errorBody);
                throw new Error(errorBody || `API request failed with status ${response.status}`);
            }

            // Handle empty responses
            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } catch (error) {
            console.error('Network/Request API Error:', error);
            throw error;
        }
    }
};
