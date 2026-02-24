"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    user: any;
    login: (token: string, userData: any) => void;
    logout: () => void;
    isGuest: boolean;
    setAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        const guestMode = localStorage.getItem("isGuest") === "true";

        if (savedToken && savedUser) {
            setUser(JSON.parse(savedUser));
        } else if (guestMode) {
            setIsGuest(true);
        }
    }, []);

    const login = (token: string, userData: any) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.removeItem("isGuest");
        setUser(userData);
        setIsGuest(false);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setIsGuest(false);
    };

    const setAsGuest = async () => {
        try {
            const res = await (await import("@/lib/api")).api.auth.login({
                email: "demo@archshield.io",
                password: "demo123"
            });
            login(res.access_token, res.user);
        } catch (err) {
            console.error("Demo login failed:", err);
            // Fallback to local guest mode if API fails
            localStorage.setItem("isGuest", "true");
            setIsGuest(true);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isGuest, setAsGuest }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
