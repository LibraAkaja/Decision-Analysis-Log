import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("[API] Request with token:", {
                method: config.method,
                url: config.url,
                hasToken: !!token,
                tokenLength: token.length,
            });
        } else {
            console.log("[API] Request without token:", {
                method: config.method,
                url: config.url,
            });
        }
        return config;
    },
    (error) => {
        console.error("[API] Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log("[API] Response success:", {
            status: response.status,
            url: response.config.url,
        });
        return response;
    },
    (error) => {
        console.error("[API] Response error:", {
            status: error.response?.status,
            url: error.config?.url,
            message: error.response?.data?.detail || error.message,
        });
        return Promise.reject(error);
    }
);

// AUTH ENDPOINTS

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const refreshToken = (refresh_token) => 
    api.post("/auth/refresh", { refresh_token });

export const getCurrentUser = () => api.get("/auth/me");

export const logoutUser = () => api.post("/auth/logout");

// DECISIONS ENDPOINTS

export const fetchDecisions = () => api.get("/decisions");

export const getDecisionById = (decisionId) => 
    api.get(`/decisions/${decisionId}`);

export const createDecision = (data) => 
    api.post("/decisions", data);

export const updateDecision = (decisionId, data) => 
    api.patch(`/decisions/${decisionId}`, data);

export const deleteDecision = (decisionId) => 
    api.delete(`/decisions/${decisionId}`);

// OPTIONS ENDPOINTS

export const addOption = (data) => 
    api.post("/options", data);

export const getOptions = (decisionId) => 
    api.get(`/options/${decisionId}`);

export const updateOption = (optionId, data) => 
    api.patch(`/options/${optionId}`, data);

export const deleteOption = (optionId) => 
    api.delete(`/options/${optionId}`);

// ADMIN ENDPOINTS

export const getAllUsers = () => api.get("/admin/users");

export const updateUserRole = (userId, data) => 
    api.patch(`/admin/users/${userId}/role`, data);

export const deleteUser = (userId) => 
    api.delete(`/admin/users/${userId}`);

export const getAdminDashboard = () => 
    api.get("/admin/dashboard");

export default api;