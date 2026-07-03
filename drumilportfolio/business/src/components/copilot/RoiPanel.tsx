"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart2, CheckCircle, X, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

const MODULE_COLOR: Record<string, string> = {
    CASHFLOW: "text-rose-400",
    FOLLOWUP: "text-amber-400",
    CHURN: "text-orange-400",
    PROCUREMENT: "text-blue-400",
    DIGEST: "text-indigo-400",
};

const OUTCOME_ICON: Record<string, React.ReactNode> = {
    RESOLVED: <CheckCircle size={12} className="text-emerald-400" />,
    IGNORED: <X size={12} className="text-slate-500" />,
    WRONG: <AlertTriangle size={12} className="text-rose-400" />,
};

export default function RoiPanel() {
    const [roi, setRoi] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.audit.getRoi().catch(() => []),
            api.audit.getLogs().catch(() => []),
        ]).then(([r, l]) => { setRoi(r); setLogs(l); }).finally(() => setLoading(false));
    }, []);

    const recordOutcome = async (id: string, outcome: string, idx: number) => {
        await api.audit.recordOutcome(id, outcome as any).catch(() => null);
        setLogs(prev => prev.map((l, i) => i === idx ? { ...l, outcome } : l));
    };

    if (loading) return <div className="h-64 bg-slate-900/40 rounded-3xl animate-pulse" />;

    return (
        <div className="space-y-6 font-sans">
            {/* ROI Summary */}
            <div className="p-6 rounded-[2rem] border border-slate-900 bg-slate-900/30">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart2 size={16} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Module ROI Summary</span>
                </div>
                {roi.length === 0 ? (
                    <p className="text-slate-600 text-sm py-4 text-center">No audit data yet — actions will appear here as they&apos;re taken.</p>
                ) : (
                    <div className="space-y-3">
                        {roi.map((m: any, i: number) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                                className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800"
                            >
                                <span className={`text-[10px] font-black w-24 shrink-0 ${MODULE_COLOR[m.module] || "text-slate-400"}`}>{m.module}</span>
                                <div className="flex-1">
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${m.resolutionRate}%` }} />
                                    </div>
                                </div>
                                <div className="text-right shrink-0 min-w-[60px]">
                                    <p className="text-xs font-black text-white">{m.resolutionRate}%</p>
                                    <p className="text-[9px] text-slate-600">{m.total} actions</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Audit Log */}
            <div className="p-6 rounded-[2rem] border border-slate-900 bg-slate-900/30">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Audit Trail</span>
                    <span className="ml-auto text-[9px] text-slate-700">{logs.length} entries</span>
                </div>
                <div className="space-y-2">
                    {logs.slice(0, 20).map((log: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="shrink-0 mt-0.5">{OUTCOME_ICON[log.outcome] || <div className="w-3 h-3 rounded-full bg-slate-700" />}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-[9px] font-black ${MODULE_COLOR[log.module] || "text-slate-500"}`}>{log.module}</span>
                                    <span className="text-[9px] text-slate-600">{log.action}</span>
                                    <span className="text-[9px] text-slate-700">{new Date(log.createdAt).toLocaleDateString()}</span>
                                </div>
                                {log.reasoning && <p className="text-[10px] text-slate-500 mt-0.5 truncate">{log.reasoning}</p>}
                            </div>
                            {!log.outcome && (
                                <div className="flex gap-1 shrink-0">
                                    {["RESOLVED", "IGNORED", "WRONG"].map(o => (
                                        <button key={o} onClick={() => recordOutcome(log.id, o, i)}
                                            className="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-slate-800 hover:bg-slate-700 text-slate-400 uppercase transition-all"
                                        >{o[0]}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
