"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  getUser,
  saveUser,
  removeUser,
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app load
    const checkAuth = () => {
      try {
        const savedUser = getUser();
        const savedToken = getAuthToken();

        if (savedUser && savedToken) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear any corrupted data
        removeUser();
        removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (user: User, token: string) => {
    saveUser(user);
    saveAuthToken(token);
    setUser(user);
  };

  const logout = () => {
    removeUser();
    removeAuthToken();
    setUser(null);
    // Redirect to home page after logout
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
