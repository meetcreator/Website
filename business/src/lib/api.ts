const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
}

export const api = {
    analytics: {
        getKpis: (range?: string) => fetchWithAuth(`/analytics/kpis${range ? `?range=${range}` : ''}`),
        getTrends: (range?: string) => fetchWithAuth(`/analytics/trends${range ? `?range=${range}` : ''}`),
        deployCampaign: (data: { name: string; segment: string }) => fetchWithAuth('/analytics/campaign/deploy', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getForecasts: () => fetchWithAuth('/analytics/forecasts'),
        getInsights: () => fetchWithAuth('/analytics/insights'),
    },
    inventory: {
        getAll: () => fetchWithAuth('/inventory'),
        restockAll: () => fetchWithAuth('/inventory/restock', { method: 'POST' }),
        updateStock: (id: string, delta: number) =>
            fetchWithAuth(`/inventory/${id}/update`, {
                method: 'POST',
                body: JSON.stringify({ delta })
            }),
        create: (data: any) => fetchWithAuth('/inventory', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        delete: (id: string) => fetchWithAuth(`/inventory/${id}/delete`, { method: 'POST' }),
    },
    clients: {
        getAll: () => fetchWithAuth('/clients'),
        create: (data: any) => fetchWithAuth('/clients', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        delete: (name: string) => fetchWithAuth('/clients/delete', {
            method: 'POST',
            body: JSON.stringify({ name })
        }),
    },
    auth: {
        login: (credentials: any) => fetchWithAuth('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
    },
    ai: {
        chat: (message: string) => fetchWithAuth('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message })
        }),
    }
};
