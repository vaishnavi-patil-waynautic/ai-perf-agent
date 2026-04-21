import { config } from "@/config/backendConfig";

const API_BASE = config.baseUrl;

const BASE_URL = `${API_BASE}/governance`;

const fetchWrapper = async (url: string, options: RequestInit = {}) => {

    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Missing access token");



    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw error;
    }

    return res.json();
};

export const GovernanceService = {
    getRoiOverview: (params: { project_id: number; period?: string }) => {
                console.log("Calling governance api_____________________________________3")
        const query = new URLSearchParams(params as any).toString();
        return fetchWrapper(`${BASE_URL}/roi-dashboard/overview/?${query}`);
    },

    getLlmUsageSummary: (params: { project_id: number }) => {
        const query = new URLSearchParams(params as any).toString();
        return fetchWrapper(`${BASE_URL}/llm-usage/summary/?${query}`);
    },

    getLlmUsageList: (params: any) => {
        const query = new URLSearchParams(params as any).toString();
        return fetchWrapper(`${BASE_URL}/llm-usage/?${query}`);
    },
};