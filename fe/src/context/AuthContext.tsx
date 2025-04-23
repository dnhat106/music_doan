import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../hook/auth/useUserInfo";
import { useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";

interface AuthContextType {
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { data: user } = useUserInfo();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsAdmin(!!user.adminId);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, [user, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    notification.success({
      message: "Logged out successfully",
    });
    queryClient.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ logout, isLoading, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
