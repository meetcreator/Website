"use client";

import { useState, useEffect, useCallback } from "react";
import {
    LayoutDashboard, Users, ShoppingCart, TrendingUp, AlertCircle,
    Package, Zap, ArrowUpRight, ArrowDownRight, Filter, LogOut,
    Menu, X, BrainCircuit, Mail, TrendingDown, ShieldAlert, Truck,
    BarChart2, SlidersHorizontal
} from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import GrowthChart from "@/components/charts/GrowthChart";
import SegmentChart from "@/components/charts/SegmentChart";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "@/components/auth/LoginPage";
import ClientMaster from "@/components/dashboard/ClientMaster";
import CustomerSegments from "@/components/dashboard/CustomerSegments";
import InventoryList from "@/components/dashboard/InventoryList";
import Chatbot from "@/components/dashboard/Chatbot";
import DigestCard from "@/components/copilot/DigestCard";
import FollowUpPanel from "@/components/copilot/FollowUpPanel";
import CashFlowPanel from "@/components/copilot/CashFlowPanel";
import ChurnPanel from "@/components/copilot/ChurnPanel";
import ProcurementPanel from "@/components/copilot/ProcurementPanel";
import SettingsPanel from "@/components/copilot/SettingsPanel";
import RoiPanel from "@/components/copilot/RoiPanel";

export default function Home() {
    return (
        <AuthProvider>
            <DashboardContent />
        </AuthProvider>
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
        >
            {icon}
            <span className="font-bold text-sm tracking-tight">{label}</span>
        </div>
    );
}

function KpiCard({ title, value, delta, trend }: { title: string; value: string; delta: string; trend: "up" | "down" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
        >
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">{title}</p>
            <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black tracking-tighter text-slate-900">{value}</h3>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${trend === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-500"}`}>
                    {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {delta}
                </div>
            </div>
        </motion.div>
    );
}

const COPILOT_VIEWS = ["Digest", "FollowUp", "CashFlow", "Churn", "Procurement", "Settings", "Roi"];

function DashboardContent() {
    const { user, isGuest, logout } = useAuth();
    const [businessType, setBusinessType] = useState<"B2B" | "B2C" | null>(null);
    const [activeView, setActiveView] = useState<string>("Overview");
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [forecastData, setForecastData] = useState<any[]>([]);
    const [insights, setInsights] = useState<any[]>([]);
    const [kpis, setKpis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dateRange, setDateRange] = useState("12M");
    const [showProfit, setShowProfit] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [kpiData, trendData, forecasts, insightsData] = await Promise.all([
                api.analytics.getKpis(dateRange).catch(() => null),
                api.analytics.getTrends(dateRange).catch(() => []),
                api.analytics.getForecasts().catch(() => []),
                api.analytics.getInsights().catch(() => []),
            ]);
            if (kpiData) setKpis(kpiData);
            setRevenueData(trendData);
            setForecastData(forecasts);
            setInsights(insightsData);
            setError(trendData.length === 0 && !kpiData ? "Operational systems offline or no data available." : null);
        } catch {
            setError("Operational systems offline. Check connection.");
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => { if (user || isGuest) fetchData(); }, [businessType, user, isGuest, dateRange, fetchData]);

    const handleSocketEvent = useCallback((event: string) => {
        if (event.startsWith("inventory.") || event.startsWith("client.") || event.startsWith("analytics.")) fetchData();
    }, [fetchData]);
    useSocket(handleSocketEvent);

    if (!user && !isGuest) return <LoginPage />;

    if (!businessType) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900 flex flex-col items-center justify-center p-6">
                <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-sm font-bold tracking-wide">
                        <Zap size={16} /> NEXUSIQ INTELLIGENCE ENGINE v4.0
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-slate-900">
                        SELECT YOUR <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-600">OPERATIONAL</span> VECTOR
                    </h1>
                    <p className="text-slate-500 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Connect your data streams to the NexusIQ core. Select a business model to initialize the specialized analytics layers.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        <button onClick={() => setBusinessType("B2B")} className="group p-10 rounded-[3rem] bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all hover:scale-[1.02] text-left">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white"><Users size={28} /></div>
                            <h3 className="text-3xl font-bold mb-2 text-slate-900">Industrial Hub</h3>
                            <p className="text-slate-400 mb-6 uppercase text-xs font-black tracking-widest">B2B SaaS / Enterprise</p>
                            <p className="text-slate-500 font-light">Focus on high-value client retention, weighted pipelines, and recurring contract value.</p>
                        </button>
                        <button onClick={() => setBusinessType("B2C")} className="group p-10 rounded-[3rem] bg-white border border-slate-200 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all hover:scale-[1.02] text-left">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white"><ShoppingCart size={28} /></div>
                            <h3 className="text-3xl font-bold mb-2 text-slate-900">Direct to Consumer</h3>
                            <p className="text-slate-400 mb-6 uppercase text-xs font-black tracking-widest">E-Commerce / Retail</p>
                            <p className="text-slate-500 font-light">Optimize for high-velocity transactions, churn risk detection, and LTV prediction.</p>
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const nav = (close?: () => void) => (
        <nav className="flex flex-col gap-1">
            <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeView === "Overview"} onClick={() => { setActiveView("Overview"); close?.(); }} />
            {businessType === "B2B"
                ? <NavItem icon={<Users size={20} />} label="Accounts" active={activeView === "Accounts"} onClick={() => { setActiveView("Accounts"); close?.(); }} />
                : <NavItem icon={<Users size={20} />} label="Segments" active={activeView === "Segments"} onClick={() => { setActiveView("Segments"); close?.(); }} />
            }
            <NavItem icon={<Package size={20} />} label="Inventory" active={activeView === "Inventory"} onClick={() => { setActiveView("Inventory"); close?.(); }} />
            <NavItem icon={<TrendingUp size={20} />} label="Forecasting" active={activeView === "Forecasting"} onClick={() => { setActiveView("Forecasting"); close?.(); }} />
            <NavItem icon={<Zap size={20} />} label="Insights" active={activeView === "Insights"} onClick={() => { setActiveView("Insights"); close?.(); }} />
            <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 mb-1">Co-Pilot</p>
                <NavItem icon={<BrainCircuit size={20} />} label="Digest" active={activeView === "Digest"} onClick={() => { setActiveView("Digest"); close?.(); }} />
                <NavItem icon={<Mail size={20} />} label="Follow-Up" active={activeView === "FollowUp"} onClick={() => { setActiveView("FollowUp"); close?.(); }} />
                <NavItem icon={<TrendingDown size={20} />} label="Cash Flow" active={activeView === "CashFlow"} onClick={() => { setActiveView("CashFlow"); close?.(); }} />
                <NavItem icon={<ShieldAlert size={20} />} label="Churn Risk" active={activeView === "Churn"} onClick={() => { setActiveView("Churn"); close?.(); }} />
                <NavItem icon={<Truck size={20} />} label="Procurement" active={activeView === "Procurement"} onClick={() => { setActiveView("Procurement"); close?.(); }} />
                <NavItem icon={<BarChart2 size={20} />} label="ROI Tracker" active={activeView === "Roi"} onClick={() => { setActiveView("Roi"); close?.(); }} />
                <NavItem icon={<SlidersHorizontal size={20} />} label="Settings" active={activeView === "Settings"} onClick={() => { setActiveView("Settings"); close?.(); }} />
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200">
                <NavItem icon={<LogOut size={20} />} label="Disconnect" onClick={() => { logout(); close?.(); }} />
            </div>
        </nav>
    );

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 flex">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-b border-slate-200 z-50 flex items-center justify-between px-6 font-sans">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <Zap size={18} className="fill-white" />
                    </div>
                    <span className="font-black text-lg tracking-tighter text-slate-900">NexusIQ</span>
                </div>
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-slate-700 transition-colors">
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden" />
                        <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 p-6 z-[70] md:hidden flex flex-col gap-6 font-sans overflow-y-auto"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                        <Zap size={24} className="fill-white" />
                                    </div>
                                    <span className="font-black text-xl tracking-tighter text-slate-900">NexusIQ</span>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                                    <X size={20} />
                                </button>
                            </div>
                            {nav(() => setMobileMenuOpen(false))}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-slate-200 p-6 hidden md:flex flex-col gap-8 bg-white sticky top-0 h-screen font-sans overflow-y-auto shadow-sm">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Zap size={24} className="fill-white" />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-slate-900">NexusIQ</span>
                </div>
                {nav()}
                <div className="mt-auto p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-500 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Active License</p>
                        <p className="text-sm font-bold mb-4 text-white">Enterprise v4.0</p>
                        <button onClick={() => setBusinessType(null)} className="text-[10px] font-black text-blue-200 hover:text-white uppercase tracking-widest transition-colors">
                            Switch Operational Vector
                        </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={80} />
                    </div>
                </div>
            </aside>

            {/* Content */}
            <div className="flex-1 p-6 md:p-10 pt-24 md:pt-10 max-w-[1600px] mx-auto w-full overflow-y-auto">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-6 sm:gap-0 font-sans">
                    <div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                            {loading ? "Syncing..." : "System Operational"} / {activeView.toUpperCase()}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{activeView}</h2>
                        {error && (
                            <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}
                        <p className="text-slate-500 mt-2 font-light">
                            {activeView === "Overview"
                                ? `Real-time performance metrics for your ${businessType || "Core"} operations.`
                                : `In-depth analysis and controls for your ${activeView.toLowerCase()} module.`}
                        </p>
                    </div>
                    {!COPILOT_VIEWS.includes(activeView) && (
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setFilterOpen(f => !f)}
                                className={`flex flex-1 sm:flex-initial items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${filterOpen ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"}`}
                            >
                                <Filter size={16} /> Filters {filterOpen ? "▲" : "▼"}
                            </button>
                            <button
                                onClick={() => {
                                    const rows = [
                                        ["Metric", "Value"],
                                        ["Total Revenue", kpis?.totalRevenue ? `$${(kpis.totalRevenue / 1000).toFixed(1)}k` : "$842.9k"],
                                        ["Operating Profit", kpis?.totalProfit ? `$${(kpis.totalProfit / 1000).toFixed(1)}k` : "$124.5k"],
                                        ["Burn Rate", kpis?.burnRate ? `-$${(kpis.burnRate / 1000).toFixed(1)}k` : "-$12.4k"],
                                        [], ["Month", "Revenue", "Profit"],
                                        ...revenueData.map((d: any) => [d.name, d.revenue, d.profit]),
                                    ];
                                    const csv = rows.map(r => r.join(",")).join("\n");
                                    const blob = new Blob([csv], { type: "text/csv" });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url; a.download = `nexusiq_${activeView.toLowerCase()}.csv`; a.click();
                                    URL.revokeObjectURL(url);
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                            >
                                Export
                            </button>
                        </div>
                    )}
                </header>

                <AnimatePresence>
                    {filterOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
                            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 font-sans">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Time Horizon</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["1M", "3M", "6M", "12M", "YTD"].map(r => (
                                            <button key={r} onClick={() => setDateRange(r)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${dateRange === r ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                                            >{r}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Metric Focus</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowProfit(true)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${showProfit ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>PROFIT</button>
                                        <button onClick={() => setShowProfit(false)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${!showProfit ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>REVENUE</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {activeView === "Overview" && (
                    <div className="space-y-8 md:space-y-12">
                        <DigestCard />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <KpiCard title="Total Revenue" value={kpis?.totalRevenue ? `$${(kpis.totalRevenue / 1000).toFixed(1)}k` : "$842.9k"} delta={kpis?.deltaRevenue || "+12.4%"} trend="up" />
                            <KpiCard title="Operating Profit" value={kpis?.totalProfit ? `$${(kpis.totalProfit / 1000).toFixed(1)}k` : "$124.5k"} delta={kpis?.deltaProfit || "+5.2%"} trend="up" />
                            <KpiCard title="Burn Rate" value={kpis?.burnRate ? `-$${(kpis.burnRate / 1000).toFixed(1)}k` : "-$12.4k"} delta="0.0%" trend="up" />
                            <KpiCard title={businessType === "B2B" ? "Weighted Pipeline" : "LTV Prediction"} value={businessType === "B2B" ? "$1.2M" : `$${kpis?.ltv?.toFixed(2) || "194.20"}`} delta="+8.1%" trend="up" />
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className="xl:col-span-2 p-6 md:p-10 rounded-[2.5rem] border border-slate-200 bg-white shadow-sm font-sans">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tighter text-slate-900">Financial Vector</h3>
                                        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">Revenue vs Profit Analysis</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-[10px] font-black text-slate-400 uppercase">Revenue</span></div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500" /><span className="text-[10px] font-black text-slate-400 uppercase">Profit</span></div>
                                    </div>
                                </div>
                                <div className="h-80 md:h-96"><GrowthChart data={revenueData} type="area" color="#3b82f6" /></div>
                            </div>
                            <div className="p-6 md:p-10 rounded-[2.5rem] border border-slate-200 bg-white shadow-sm flex flex-col font-sans">
                                <h3 className="text-2xl font-black tracking-tighter mb-2 text-slate-900">Segment Velocity</h3>
                                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-10">Market Share Distribution</p>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="h-64">
                                        <SegmentChart data={businessType === "B2B" ? [
                                            { name: "Enterprise", value: 45, color: "#3b82f6" },
                                            { name: "Mid-Market", value: 30, color: "#6366f1" },
                                            { name: "SMB", value: 25, color: "#e2e8f0" },
                                        ] : [
                                            { name: "Premium", value: 55, color: "#3b82f6" },
                                            { name: "Standard", value: 35, color: "#6366f1" },
                                            { name: "Basic", value: 10, color: "#e2e8f0" },
                                        ]} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-10">
                                        {[{ label: "High Growth", val: "42%", color: "bg-blue-500" }, { label: "Stable", val: "38%", color: "bg-indigo-600" }, { label: "At Risk", val: "20%", color: "bg-slate-300" }].map((s, i) => (
                                            <div key={i} className="text-center">
                                                <div className={`w-2 h-2 rounded-full ${s.color} mx-auto mb-2`} />
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{s.label}</p>
                                                <p className="text-lg font-black text-slate-900">{s.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === "Inventory" && <InventoryList />}
                {activeView === "Accounts" && <ClientMaster />}
                {activeView === "Segments" && <CustomerSegments />}

                {activeView === "Forecasting" && (
                    <div className="space-y-8">
                        <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm p-10 font-sans">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap size={18} className="text-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Predictive Engine</span>
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter mb-8 text-slate-900">6-Month Revenue Forecast</h3>
                            <div className="h-72">
                                <GrowthChart data={forecastData.length > 0 ? forecastData : [{ name: "Next 1", revenue: 0, profit: 0 }, { name: "Next 2", revenue: 0, profit: 0 }, { name: "Next 3", revenue: 0, profit: 0 }]} type="area" color="#6366f1" />
                            </div>
                            <p className="text-slate-400 text-sm mt-4 font-light">Forecast based on trailing 12-month seasonality patterns. Confidence interval: 87%.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                            {[{ label: "Projected Q1 Revenue", value: "$1.04M", delta: "+12.3%" }, { label: "Churn Risk Score", value: "14.2%", delta: "-3.1%" }, { label: "Predicted CAC", value: "$42.80", delta: "-8.5%" }].map((item, i) => (
                                <div key={i} className="p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{item.label}</p>
                                    <p className="text-3xl font-black tracking-tighter mb-2 text-slate-900">{item.value}</p>
                                    <span className="text-xs font-bold text-emerald-600">{item.delta} vs last period</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeView === "Insights" && (
                    <div className="space-y-6">
                        <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm p-10 font-sans">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap size={18} className="text-indigo-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">NexusIQ Intelligence Feed</span>
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter mb-8 text-slate-900">Automated Business Insights</h3>
                            <div className="space-y-4">
                                {insights.map((insight, i) => (
                                    <div key={i} className={`p-6 rounded-3xl border flex items-start gap-5 ${insight.severity === "positive" ? "border-emerald-500/20 bg-emerald-50" : insight.severity === "warning" ? "border-amber-500/20 bg-amber-50" : "border-slate-200 bg-slate-50"}`}>
                                        <span className="text-2xl">{insight.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-900 mb-1">{insight.title}</h4>
                                                <span className="text-[10px] text-slate-400 font-bold ml-4 whitespace-nowrap">{insight.time}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm font-light">{insight.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeView === "Digest" && <div className="max-w-3xl"><DigestCard /></div>}
                {activeView === "FollowUp" && <div className="max-w-3xl"><FollowUpPanel /></div>}
                {activeView === "CashFlow" && <div className="max-w-3xl"><CashFlowPanel /></div>}
                {activeView === "Churn" && <div className="max-w-3xl"><ChurnPanel /></div>}
                {activeView === "Procurement" && (
                    <div className="max-w-3xl space-y-8">
                        <ProcurementPanel />
                        <Chatbot inline />
                    </div>
                )}
                {activeView === "Settings" && <div className="max-w-2xl"><SettingsPanel /></div>}
                {activeView === "Roi" && <div className="max-w-3xl"><RoiPanel /></div>}
            </div>
        </main>
    );
}
