import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(() => localStorage.getItem('user_id'));
    const [userEmail, setUserEmail] = useState(() => localStorage.getItem('user_email'));
    const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem('user_id'));

    useEffect(() => {
        const sync = () => {
            const userId = localStorage.getItem('user_id');
            const userEmail = localStorage.getItem('user_email');
            setUserId(userId);
            setUserEmail(userEmail);
            setIsAuth(!!userId);
        }

        addEventListener('storage', sync);
        return () => removeEventListener('storage', sync);
    }, []);

    const login = (userId, userEmail) => {
        localStorage.setItem('user_id', userId);
        localStorage.setItem('user_email', userEmail);
        setUserId(userId);
        setUserEmail(userEmail);
        setIsAuth(true);
    }

    const logout = () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        setUserId(null);
        setUserEmail(null);
        setIsAuth(false);
    }

    return (
        <AuthContext.Provider value={{ userId, userEmail, isAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

