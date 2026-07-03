"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { api } from "@/lib/api";

function ScoreRing({ score }: { score: number }) {
    const color = score < 40 ? "#f43f5e" : score < 65 ? "#f59e0b" : "#10b981";
    const r = 20;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;

    return (
        <div className="relative shrink-0">
            <svg width="52" height="52" className="-rotate-90">
                <circle cx="26" cy="26" r={r} fill="none" stroke="#1e293b" strokeWidth="4" />
                <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black" style={{ color }}>
                {score}
            </span>
        </div>
    );
}

function FactorBar({ factor }: { factor: any }) {
    const color = factor.direction === 'up' ? 'bg-emerald-500' : 'bg-rose-500';
    return (
        <div className="flex items-center gap-3 text-xs">
            <span className="w-36 text-slate-400 text-[10px] shrink-0 truncate">{factor.name}</span>
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, (factor.contribution / (factor.weight * 100)) * 100)}%` }} />
            </div>
            <span className="text-[10px] text-slate-500 w-12 text-right shrink-0">{factor.value}</span>
        </div>
    );
}

export default function ChurnPanel() {
    const [scores, setScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        api.churn.getScores()
            .then(setScores)
            .catch(() => setScores([]))
            .finally(() => setLoading(false));
    }, []);

    const atRisk = scores.filter(s => s.score < 40);
    const watch = scores.filter(s => s.score >= 40 && s.score < 65);
    const healthy = scores.filter(s => s.score >= 65);

    if (loading) return (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-900/40 rounded-2xl" />)}
        </div>
    );

    return (
        <div className="space-y-6 font-sans">
            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'At Risk', count: atRisk.length, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
                    { label: 'Watch', count: watch.length, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                    { label: 'Healthy', count: healthy.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                ].map(s => (
                    <div key={s.label} className={`p-3 rounded-2xl border text-center ${s.bg}`}>
                        <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${s.color}`}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Account list */}
            <div className="space-y-3">
                {scores.length === 0 && (
                    <p className="text-center text-slate-600 text-sm py-8">No health scores computed yet.</p>
                )}
                {scores.map((s: any, i: number) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden"
                    >
                        <button
                            className="w-full flex items-center gap-4 p-4 text-left"
                            onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                        >
                            <ScoreRing score={s.score} />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-white">{s.customer?.name || s.client?.name}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                    {s.score < 40 ? '⚠ High churn risk' : s.score < 65 ? '👁 Monitor' : '✓ Healthy'}
                                    {' · '}Top risk: {(s.factors as any[])?.[0]?.name}
                                </p>
                            </div>
                            {expanded === s.id ? <ChevronUp size={14} className="text-slate-500 shrink-0" /> : <ChevronDown size={14} className="text-slate-500 shrink-0" />}
                        </button>

                        {expanded === s.id && (
                            <div className="px-4 pb-4 border-t border-slate-800/50 pt-4 space-y-4">
                                {/* Factor breakdown */}
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Score breakdown</p>
                                    <div className="space-y-2">
                                        {(s.factors as any[]).map((f: any, fi: number) => (
                                            <FactorBar key={fi} factor={f} />
                                        ))}
                                    </div>
                                </div>

                                {/* Retention suggestion */}
                                {s.suggestion && (
                                    <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                        <Lightbulb size={12} className="text-blue-400 mt-0.5 shrink-0" />
                                        <p className="text-xs text-slate-300 leading-relaxed">{s.suggestion}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
