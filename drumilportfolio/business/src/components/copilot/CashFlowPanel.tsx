"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingDown, AlertTriangle, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";

const HORIZON_LABELS: Record<number, string> = { 30: "30 days", 60: "60 days", 90: "90 days" };
const HORIZON_COLOR = (projected: number) =>
    projected < 0 ? "text-rose-400" : projected < 10000 ? "text-amber-400" : "text-emerald-400";
const HORIZON_BAR = (projected: number) =>
    projected < 0 ? "bg-rose-500" : projected < 10000 ? "bg-amber-400" : "bg-emerald-500";

export default function CashFlowPanel() {
    const [projections, setProjections] = useState<any[]>([]);
    const [anomalies, setAnomalies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedAnomaly, setExpandedAnomaly] = useState<number | null>(null);

    useEffect(() => {
        Promise.all([
            api.cashflow.getProjections().catch(() => []),
            api.cashflow.getAnomalies().catch(() => []),
        ]).then(([proj, anom]) => {
            setProjections(proj);
            setAnomalies(anom);
        }).finally(() => setLoading(false));
    }, []);

    const maxAbs = Math.max(...projections.map(p => Math.abs(p.projected)), 1);

    if (loading) return (
        <div className="space-y-6 animate-pulse">
            <div className="h-40 bg-slate-900/40 rounded-3xl" />
            <div className="h-40 bg-slate-900/40 rounded-3xl" />
        </div>
    );

    return (
        <div className="space-y-6 font-sans">
            {/* Projections */}
            <div className="p-6 md:p-8 rounded-[2rem] border border-slate-900 bg-slate-900/30">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingDown size={16} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cash Flow Projection</span>
                </div>
                <h3 className="text-xl font-black tracking-tight text-white mb-6">30 / 60 / 90-Day Outlook</h3>

                <div className="space-y-5">
                    {projections.map((p: any, i: number) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400">{HORIZON_LABELS[p.horizon] || `${p.horizon}d`}</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-black ${HORIZON_COLOR(p.projected)}`}>
                                        {p.projected < 0 ? '-' : '+'}${Math.abs(p.projected / 1000).toFixed(0)}k
                                    </span>
                                    <span className="text-[9px] text-slate-600 font-bold">{Math.round(p.confidence * 100)}% conf.</span>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${HORIZON_BAR(p.projected)}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (Math.abs(p.projected) / maxAbs) * 100)}%` }}
                                    transition={{ delay: i * 0.1 + 0.2, duration: 0.6, ease: "easeOut" }}
                                />
                            </div>
                            {p.warnings && (p.warnings as any[]).map((w: any, wi: number) => (
                                <div key={wi} className="mt-2 flex items-start gap-2 text-[10px] text-amber-400/80 font-medium">
                                    <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                                    {w.message}
                                </div>
                            ))}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Anomalies */}
            {anomalies.length > 0 && (
                <div className="p-6 md:p-8 rounded-[2rem] border border-slate-900 bg-slate-900/30">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} className="text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Anomaly Detection</span>
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-white mb-6">{anomalies.length} Flag{anomalies.length > 1 ? 's' : ''} Detected</h3>

                    <div className="space-y-3">
                        {anomalies.map((a: any, i: number) => (
                            <div key={i} className={`rounded-2xl border overflow-hidden ${a.severity === 'high' ? 'border-rose-500/20 bg-rose-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                                <button
                                    className="w-full flex items-center justify-between p-4 text-left"
                                    onClick={() => setExpandedAnomaly(expandedAnomaly === i ? null : i)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${a.severity === 'high' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                                        <span className="font-bold text-sm text-white">{a.title}</span>
                                        {a.estimatedImpact > 0 && (
                                            <span className="text-[10px] font-black text-slate-500">${(a.estimatedImpact / 1000).toFixed(0)}k</span>
                                        )}
                                    </div>
                                    {expandedAnomaly === i ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                                </button>
                                {expandedAnomaly === i && (
                                    <div className="px-4 pb-4">
                                        <p className="text-xs text-slate-400 font-light leading-relaxed">{a.reasoning}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
