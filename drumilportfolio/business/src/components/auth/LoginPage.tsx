"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Zap, Mail, Lock, ArrowRight, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const { login, setAsGuest } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.auth.login({ email, password });
            login(res.access_token, res.user);
        } catch (err) {
            setError("Invalid credentials. Try guest mode!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
                        <Zap size={32} className="fill-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 text-slate-900">NexusIQ</h1>
                    <p className="text-slate-500 font-medium">Sign in to your management dashboard.</p>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email or Username</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        {error && <p className="text-rose-500 text-xs font-bold text-center animate-pulse">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4 relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">No account? Use Demo Entry</p>
                        <button
                            onClick={setAsGuest}
                            className="w-full bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
                        >
                            <UserCircle size={18} />
                            Continue as Guest
                        </button>
                    </div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16"></div>
                </div>

                <p className="mt-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    Encryption: AES-256-GCM · NexusIQ Enterprise
                </p>
                <p className="mt-3 text-center text-slate-400 text-[10px]">
                    Demo access: <span className="text-slate-500 font-mono">click guest entry</span> or use <span className="text-slate-500 font-mono">demo@nexusiq.io</span>
                </p>
            </motion.div>
        </div>
    );
}
