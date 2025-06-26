import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem("user_id"));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("user_email"));
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem("user_id"));

  useEffect(() => {
    const sync = () => {
      const uid = localStorage.getItem("user_id");
      const email = localStorage.getItem("user_email");
      setUserId(uid);
      setUserEmail(email);
      setIsAuth(!!uid);
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const login = (userId, email) => {
    localStorage.setItem("user_id", userId);
    localStorage.setItem("user_email", email);
    setUserId(userId);
    setUserEmail(email);
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    setUserId(null);
    setUserEmail(null);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, userId, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
