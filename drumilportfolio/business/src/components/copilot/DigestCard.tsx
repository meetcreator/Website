"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingDown, Package, Users, AlertTriangle, CheckCircle, ChevronRight, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

const MODULE_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    CASHFLOW: { icon: <TrendingDown size={14} />, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
    FOLLOWUP: { icon: <Users size={14} />, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    CHURN: { icon: <AlertTriangle size={14} />, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
    PROCUREMENT: { icon: <Package size={14} />, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
};

const SEVERITY_DOT: Record<string, string> = {
    high: "bg-rose-500",
    medium: "bg-amber-400",
    low: "bg-slate-500",
};

export default function DigestCard({ onAction }: { onAction?: (action: any) => void }) {
    const [digest, setDigest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actioned, setActioned] = useState<Set<number>>(new Set());
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        try {
            const data = await api.digest.get();
            setDigest(data);
        } catch {
            setDigest(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const refresh = async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    };

    const handleAction = async (item: any, idx: number) => {
        if (item.action.type === 'SEND_FOLLOWUP') {
            await api.followup.send(item.action.entityId).catch(() => null);
        }
        setActioned(prev => new Set(Array.from(prev).concat(idx)));
        onAction?.(item.action);
    };

    if (loading) {
        return (
            <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm p-8 md:p-10 animate-pulse">
                <div className="h-5 w-40 bg-slate-200 rounded mb-6" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    if (!digest) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm p-8 md:p-10 font-sans"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                            <Zap size={12} className="fill-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                            Daily Co-Pilot Brief
                        </span>
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900">
                        {digest.items?.length || 0} items need attention
                    </h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-600 font-bold">
                        {new Date(digest.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                        onClick={refresh}
                        disabled={refreshing}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    >
                        <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* AI Summary */}
            {digest.summary && (
                <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <p className="text-sm text-slate-600 leading-relaxed font-light italic">
                        &ldquo;{digest.summary}&rdquo;
                    </p>
                </div>
            )}

            {/* Items */}
            <div className="space-y-3">
                <AnimatePresence>
                    {(digest.items || []).map((item: any, idx: number) => {
                        const meta = MODULE_META[item.module] || MODULE_META['CASHFLOW'];
                        const done = actioned.has(idx);

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: done ? 0.4 : 1, x: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${done ? 'border-emerald-500/20 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
                            >
                                {/* Rank + severity */}
                                <div className="flex flex-col items-center gap-1.5 pt-0.5 shrink-0">
                                    <span className="text-[10px] font-black text-slate-600">#{idx + 1}</span>
                                    <div className={`w-2 h-2 rounded-full ${SEVERITY_DOT[item.severity] || 'bg-slate-500'}`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${meta.bg} ${meta.color}`}>
                                            {meta.icon} {item.module}
                                        </span>
                                        {item.impact > 0 && (
                                            <span className="text-[9px] font-black text-slate-600">
                                                ~${(item.impact / 1000).toFixed(0)}k impact
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-bold text-sm text-slate-900 mb-0.5">{item.title}</p>
                                    <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-2">{item.reasoning}</p>
                                </div>

                                {/* Action */}
                                <div className="shrink-0">
                                    {done ? (
                                        <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-black">
                                            <CheckCircle size={14} /> Done
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAction(item, idx)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[10px] font-black text-blue-700 transition-all whitespace-nowrap"
                                        >
                                            {item.action.label} <ChevronRight size={10} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
