/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });
  const [loading, setLoading] = useState(true);

  // Initialize on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // Sometimes current user is returned as { _id, name... } or { user: {...} }
          setUser(currentUser.user || currentUser);
          setIsAuthenticated(true);
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password, employeeId) => {
    try {
      const data = await apiLogin(email, password, employeeId);
      const loggedInUser = data.user || data;
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return { success: true, user: loggedInUser };
    } catch (error) {
      return { success: false, error: error.toString() };
    }
  };

  const register = async (userData) => {
    try {
      const { name, email, password, company, role, phone, skills, inviteToken } = userData;
      const data = await apiRegister(name, email, password, company, role, phone, skills, inviteToken);
      // Depending on backend, might need to manually login after or it auto-logs in.
      return { success: true, user: data.user || data };
    } catch (error) {
      return { success: false, error: error.toString() };
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
