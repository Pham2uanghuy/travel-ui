// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

import { User } from '../utils/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;   // thêm trạng thái loading
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,   // mặc định đang loading
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);  // sau khi load user xong, tắt loading
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
