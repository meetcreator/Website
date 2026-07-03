"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { api } from "@/lib/api";

export default function ProcurementPanel() {
    const [reorderAlerts, setReorderAlerts] = useState<any[]>([]);
    const [priceDeviations, setPriceDeviations] = useState<any[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedPo, setExpandedPo] = useState<string | null>(null);
    const [approvingPo, setApprovingPo] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            api.procurement.getReorderAlerts().catch(() => []),
            api.procurement.getPriceDeviations().catch(() => []),
            api.procurement.getPurchaseOrders().catch(() => []),
        ]).then(([alerts, deviations, orders]) => {
            setReorderAlerts(alerts);
            setPriceDeviations(deviations);
            setPurchaseOrders(orders);
        }).finally(() => setLoading(false));
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleApprove = async (poId: string) => {
        setApprovingPo(poId);
        try {
            await api.procurement.approvePo(poId);
            setPurchaseOrders(pos => pos.map(po => po.id === poId ? { ...po, status: 'SENT' } : po));
            showToast('Purchase order approved and sent ✓');
        } catch {
            showToast('Failed to approve — check connection.');
        } finally {
            setApprovingPo(null);
        }
    };

    if (loading) return (
        <div className="space-y-4 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-32 bg-slate-900/40 rounded-2xl" />)}
        </div>
    );

    return (
        <div className="space-y-6 font-sans relative">
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

            {/* Reorder Alerts */}
            {reorderAlerts.length > 0 && (
                <div className="p-6 rounded-[2rem] border border-slate-900 bg-slate-900/30">
                    <div className="flex items-center gap-2 mb-4">
                        <Package size={16} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reorder Alerts</span>
                        <span className="ml-auto text-xs font-bold text-rose-400">{reorderAlerts.length} SKU{reorderAlerts.length > 1 ? 's' : ''} critical</span>
                    </div>
                    <div className="space-y-3">
                        {reorderAlerts.map((a: any, i: number) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                                className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <div className="shrink-0">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.currentQty === 0 ? 'bg-rose-500/20' : 'bg-amber-500/20'}`}>
                                        <Package size={14} className={a.currentQty === 0 ? 'text-rose-400' : 'text-amber-400'} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-white truncate">{a.productName}</p>
                                    <p className="text-[10px] text-slate-500">{a.sku} · {a.currentQty} in stock (reorder at {a.reorderPoint})</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-black text-white">Suggest {a.suggestedQty} units</p>
                                    <p className="text-[10px] text-slate-500">{a.supplierName || 'No supplier set'}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Deviations */}
            {priceDeviations.length > 0 && (
                <div className="p-6 rounded-[2rem] border border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={16} className="text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Price Creep Detected</span>
                    </div>
                    <div className="space-y-3">
                        {priceDeviations.map((d: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-white">{d.sku} · {d.supplierName}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{d.reasoning}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-black text-amber-400">+{d.pctChange}%</p>
                                    <p className="text-[10px] text-slate-500">${d.latestCost} vs avg ${d.trailing90Avg}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Purchase Orders */}
            <div className="p-6 rounded-[2rem] border border-slate-900 bg-slate-900/30">
                <div className="flex items-center gap-2 mb-4">
                    <FileText size={16} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Purchase Orders</span>
                </div>

                {purchaseOrders.length === 0 ? (
                    <p className="text-slate-600 text-sm text-center py-6">No purchase orders yet</p>
                ) : (
                    <div className="space-y-3">
                        {purchaseOrders.map((po: any) => (
                            <div key={po.id} className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                                <button
                                    className="w-full flex items-center gap-4 p-4 text-left"
                                    onClick={() => setExpandedPo(expandedPo === po.id ? null : po.id)}
                                >
                                    <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border shrink-0 ${
                                        po.status === 'DRAFT' ? 'bg-slate-700/50 border-slate-700 text-slate-400' :
                                        po.status === 'SENT' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                    }`}>{po.status}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-white">{po.supplier?.name}</p>
                                        <p className="text-[10px] text-slate-500">{po.items?.length || 0} line items</p>
                                    </div>
                                    {expandedPo === po.id ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                                </button>

                                {expandedPo === po.id && (
                                    <div className="px-4 pb-4 border-t border-slate-800/50 pt-4 space-y-3">
                                        {po.draftEmail && (
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Draft Email</p>
                                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                    {po.draftEmail}
                                                </div>
                                            </div>
                                        )}
                                        {po.status === 'DRAFT' && (
                                            <button
                                                onClick={() => handleApprove(po.id)}
                                                disabled={approvingPo === po.id}
                                                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-black text-white transition-all"
                                            >
                                                {approvingPo === po.id ? 'Sending...' : '✓ Approve & Send PO'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
