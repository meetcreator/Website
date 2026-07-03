"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, CheckCircle, ArrowUpRight, Clock } from "lucide-react";
import { api } from "@/lib/api";

function priorityBadge(score: number) {
    if (score > 7000) return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    if (score > 3000) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-blue-400 bg-blue-500/10 border-blue-500/20";
}

export default function FollowUpPanel() {
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [sending, setSending] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        api.followup.getQueue()
            .then(setQueue)
            .catch(() => setQueue([]))
            .finally(() => setLoading(false));
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSend = async (id: string, customerName: string) => {
        setSending(id);
        try {
            await api.followup.send(id);
            setQueue(q => q.filter(t => t.id !== id));
            showToast(`Follow-up sent to ${customerName} ✓`);
        } catch {
            showToast('Failed to send — check connection.');
        } finally {
            setSending(null);
            setExpanded(null);
        }
    };

    const handleDismiss = async (id: string) => {
        await api.followup.dismiss(id).catch(() => null);
        setQueue(q => q.filter(t => t.id !== id));
    };

    if (loading) return (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-900/40 rounded-2xl" />)}
        </div>
    );

    return (
        <div className="space-y-4 font-sans relative">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="absolute -top-12 left-0 right-0 flex justify-center z-10"
                    >
                        <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
                            <CheckCircle size={12} /> {toast}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight text-white">
                    Follow-Up Queue <span className="text-slate-500 font-light">({queue.length})</span>
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ranked by impact</span>
            </div>

            {queue.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-600">
                    <CheckCircle size={32} className="mb-3 text-emerald-600/40" />
                    <p className="font-bold text-sm">Queue is clear</p>
                    <p className="text-xs font-light mt-1">No stalled deals or overdue invoices</p>
                </div>
            )}

            <AnimatePresence>
                {queue.map((task: any, i: number) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden"
                    >
                        {/* Row */}
                        <div className="flex items-center gap-4 p-4">
                            <div className="flex flex-col items-center shrink-0 w-6">
                                <span className="text-[10px] font-black text-slate-600">#{i + 1}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-bold text-sm text-white">{task.customer?.name}</span>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${priorityBadge(task.priority)}`}>
                                        score {Math.round(task.priority).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <ArrowUpRight size={10} />
                                        {task.order ? `${task.order.orderNumber} · $${task.order.revenue?.toLocaleString()}` : 'No order'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={10} />
                                        {task.order?.status || 'PENDING'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => setExpanded(expanded === task.id ? null : task.id)}
                                    className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-[10px] font-black text-white transition-all flex items-center gap-1"
                                >
                                    <Mail size={10} /> Draft
                                </button>
                                <button
                                    onClick={() => handleDismiss(task.id)}
                                    className="p-1.5 rounded-xl border border-slate-800 text-slate-600 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Expanded draft */}
                        <AnimatePresence>
                            {expanded === task.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 border-t border-slate-800/50 pt-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Draft message</p>
                                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed mb-3">
                                            {task.draftMessage}
                                        </div>
                                        {task.reasoning && (
                                            <p className="text-[10px] text-slate-600 italic mb-3">Why: {task.reasoning}</p>
                                        )}
                                        <button
                                            onClick={() => handleSend(task.id, task.customer?.name)}
                                            disabled={sending === task.id}
                                            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-black text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            {sending === task.id ? 'Sending...' : '✓ Approve & Send'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
