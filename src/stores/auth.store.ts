import { create } from 'zustand';
import { User } from '../utils/types';
import { api } from '../services/api';

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    getSession: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, email: userEmail, role, id } = response.data;
            const user = { email: userEmail, role, id };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({
                token,
                user,
                isAuthenticated: true,
                loading: false,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Login failed',
                loading: false,
                isAuthenticated: false,
                user: null,
                token: null,
            });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
    },

    getSession: () => {
        set({ loading: true });
        const token = localStorage.getItem('token');
        if (token) {
            const userString = localStorage.getItem('user');
            let user = null;
            if (userString) {
                try {
                    user = JSON.parse(userString);
                } catch {
                    user = null;
                }
            }
            set({
                token,
                user: user ?? { email: 'user@gmail.com', role: '' },
                isAuthenticated: true,
                loading: false,
            });
        } else {
            set({
                token: null,
                user: null,
                isAuthenticated: false,
                loading: false,
            });
        }
    },
}));
