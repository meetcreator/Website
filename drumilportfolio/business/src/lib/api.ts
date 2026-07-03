export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://business-backend.onrender.com";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

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
        deployCampaign: (data: { name: string; segment: string }) => fetchWithAuth('/analytics/campaign/deploy', { method: 'POST', body: JSON.stringify(data) }),
        getForecasts: () => fetchWithAuth('/analytics/forecasts'),
        getInsights: () => fetchWithAuth('/analytics/insights'),
    },
    inventory: {
        getAll: () => fetchWithAuth('/inventory'),
        restockAll: () => fetchWithAuth('/inventory/restock', { method: 'POST' }),
        updateStock: (id: string, delta: number) => fetchWithAuth(`/inventory/${id}/update`, { method: 'POST', body: JSON.stringify({ delta }) }),
        create: (data: any) => fetchWithAuth('/inventory', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id: string) => fetchWithAuth(`/inventory/${id}/delete`, { method: 'POST' }),
    },
    clients: {
        getAll: () => fetchWithAuth('/clients'),
        create: (data: any) => fetchWithAuth('/clients', { method: 'POST', body: JSON.stringify(data) }),
        delete: (name: string) => fetchWithAuth('/clients/delete', { method: 'POST', body: JSON.stringify({ name }) }),
    },
    auth: {
        login: (credentials: any) => fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    },
    ai: {
        chat: (message: string) => fetchWithAuth('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
    },
    // ── Co-pilot modules ──────────────────────────────────────────────────────
    digest: {
        get: () => fetchWithAuth('/digest'),
    },
    cashflow: {
        getProjections: () => fetchWithAuth('/cashflow/projections'),
        getAnomalies: () => fetchWithAuth('/cashflow/anomalies'),
    },
    followup: {
        getQueue: () => fetchWithAuth('/followup/queue'),
        send: (id: string) => fetchWithAuth(`/followup/${id}/send`, { method: 'POST' }),
        dismiss: (id: string) => fetchWithAuth(`/followup/${id}/dismiss`, { method: 'POST' }),
        detect: () => fetchWithAuth('/followup/detect', { method: 'POST' }),
    },
    churn: {
        getScores: () => fetchWithAuth('/churn/scores'),
        recompute: () => fetchWithAuth('/churn/recompute', { method: 'POST' }),
    },
    procurement: {
        getSuppliers: () => fetchWithAuth('/procurement/suppliers'),
        getReorderAlerts: () => fetchWithAuth('/procurement/reorder-alerts'),
        getPriceDeviations: () => fetchWithAuth('/procurement/price-deviations'),
        getPurchaseOrders: () => fetchWithAuth('/procurement/purchase-orders'),
        draftPo: (data: any) => fetchWithAuth('/procurement/purchase-orders/draft', { method: 'POST', body: JSON.stringify(data) }),
        approvePo: (id: string) => fetchWithAuth(`/procurement/purchase-orders/${id}/approve`, { method: 'POST' }),
        createSupplier: (data: any) => fetchWithAuth('/procurement/suppliers', { method: 'POST', body: JSON.stringify(data) }),
    },
    settings: {
        get: () => fetchWithAuth('/settings'),
        update: (data: Record<string, any>) => fetchWithAuth('/settings', { method: 'PATCH', body: JSON.stringify(data) }),
    },
    audit: {
        getLogs: (module?: string) => fetchWithAuth(`/audit${module ? `?module=${module}` : ''}`),
        getRoi: () => fetchWithAuth('/audit/roi'),
        recordOutcome: (id: string, outcome: 'RESOLVED' | 'IGNORED' | 'WRONG') => fetchWithAuth(`/audit/${id}/outcome`, { method: 'POST', body: JSON.stringify({ outcome }) }),
    },
};
