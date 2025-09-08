"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useCurrentUser, useIsAuthenticated, useLogout } from "@/hooks/useAuth";
import { User, AuthContextType } from "@/types/auth";

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
  const [isLoading, setIsLoading] = useState(true);
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const logoutMutation = useLogout();

  useEffect(() => {
    // Set loading to false after initial render
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // This will be handled by the auth modal using React Query
    throw new Error("Use signInMutation from useAuth hooks instead");
  };

  const signup = async (data: any) => {
    // This will be handled by the auth modal using React Query
    throw new Error("Use signUpMutation from useAuth hooks instead");
  };

  const googleLogin = async (credential: string) => {
    // This will be handled by the auth modal using React Query
    throw new Error("Use googleSignInMutation from useAuth hooks instead");
  };

  const logout = async () => {
    logoutMutation.mutate();
  };

  const updateProfile = async (data: any) => {
    // This will be handled by React Query hooks
    throw new Error("Use updateProfileMutation from useAuth hooks instead");
  };

  const changePassword = async (data: any) => {
    // This will be handled by React Query hooks
    throw new Error("Use changePasswordMutation from useAuth hooks instead");
  };

  const forgotPassword = async (email: string) => {
    // This will be handled by React Query hooks
    throw new Error("Use forgotPasswordMutation from useAuth hooks instead");
  };

  const resetPassword = async (data: any) => {
    // This will be handled by React Query hooks
    throw new Error("Use resetPasswordMutation from useAuth hooks instead");
  };

  const verifyEmail = async (token: string) => {
    // This will be handled by React Query hooks
    throw new Error("Use verifyEmailMutation from useAuth hooks instead");
  };

  const resendVerification = async () => {
    // This will be handled by React Query hooks
    throw new Error(
      "Use resendVerificationMutation from useAuth hooks instead"
    );
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    googleLogin,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
