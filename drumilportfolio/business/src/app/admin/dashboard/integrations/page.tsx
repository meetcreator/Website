'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket, SocketProvider } from '@/context/SocketContext';
import { TrendingUp, Box, Users, Activity, ShoppingCart, Globe, RefreshCw, Trash2, Plus, CheckCircle2, AlertCircle, Zap, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';

function IntegrationsContent() {
    const router = useRouter();
    const { isConnected } = useSocket();
    const [integrations, setIntegrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [showConnectModal, setShowConnectModal] = useState<'SHOPIFY' | 'AMAZON' | null>(null);
    const [credentials, setCredentials] = useState<any>({});

    useEffect(() => {
        fetchIntegrations();
    }, []);

    const fetchIntegrations = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/integrations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setIntegrations(data);
        } catch (error) {
            console.error('Failed to fetch integrations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_BASE_URL}/integrations/connect`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type: showConnectModal, credentials })
            });
            setShowConnectModal(null);
            setCredentials({});
            fetchIntegrations();
        } catch (error) {
            console.error('Failed to connect', error);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_BASE_URL}/integrations/sync`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchIntegrations();
            alert('Sync completed! Check your dashboard for updated units sold.');
        } catch (error) {
            console.error('Sync failed', error);
        } finally {
            setSyncing(false);
        }
    };

    const handleRemove = async (id: string) => {
        if (!confirm('Are you sure you want to disconnect this store?')) return;
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_BASE_URL}/integrations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchIntegrations();
        } catch (error) {
            console.error('Removal failed', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex">
            {/* Sidebar (Desktop) */}
            <aside className="w-64 border-r border-slate-900 p-6 hidden md:flex flex-col gap-10 bg-slate-950/50 backdrop-blur-xl sticky top-0 h-screen font-sans">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Zap size={24} className="fill-white" />
                    </div>
                    <span className="font-black text-xl tracking-tighter italic">ARCHSHIELD</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <button onClick={() => router.push('/admin/dashboard')} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all text-slate-500 hover:text-white w-full text-left">
                        <LayoutDashboard size={20} />
                        <span className="font-bold text-sm tracking-tight">Dashboard</span>
                    </button>
                    <button onClick={() => router.push('/admin/dashboard/integrations')} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all bg-white text-slate-950 shadow-xl shadow-white/5 w-full text-left">
                        <ShoppingCart size={20} />
                        <span className="font-bold text-sm tracking-tight">Integrations</span>
                    </button>
                    <button className="flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all text-slate-500 hover:text-white w-full text-left">
                        <Users size={20} />
                        <span className="font-bold text-sm tracking-tight">Users</span>
                    </button>
                    <button className="flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all text-slate-500 hover:text-white w-full text-left">
                        <Activity size={20} />
                        <span className="font-bold text-sm tracking-tight">Activity</span>
                    </button>
                </nav>

                <div className="mt-auto p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden group">
                    <div className="relative z-10 flex items-center gap-3 mb-4">
                        <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isConnected ? 'System Online' : 'Connecting...'}</span>
                    </div>
                    <div className="relative z-10">
                        <button onClick={handleLogout} className="text-[10px] font-black text-rose-500 hover:text-white uppercase tracking-widest transition-colors w-full text-left">
                            Disconnect
                        </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={80} />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Store Integrations</h2>
                        <p className="text-gray-400">Connect your sales channels to update units sold automatically.</p>
                    </div>
                    <button
                        onClick={handleSync}
                        disabled={syncing || integrations.length === 0}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                    >
                        <RefreshCw className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
                        <span>{syncing ? 'Syncing...' : 'Sync All Stores'}</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Shopify Card */}
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-[#95BF47]/10 rounded-2xl flex items-center justify-center border border-[#95BF47]/20">
                                    <Globe className="h-8 w-8 text-[#95BF47]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Shopify</h3>
                                    <p className="text-gray-400 text-sm">Direct API & Webhook integration</p>
                                </div>
                            </div>
                            {integrations.find(i => i.type === 'SHOPIFY') ? (
                                <span className="flex items-center space-x-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>CONNECTED</span>
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-xs font-bold border border-gray-600">
                                    NOT CONNECTED
                                </span>
                            )}
                        </div>

                        <div className="space-y-4 mb-8">
                            <ul className="text-sm text-gray-400 space-y-2">
                                <li className="flex items-center space-x-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                    <span>Automatic units sold updates</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                    <span>Inventory level synchronization</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                    <span>Real-time order notifications</span>
                                </li>
                            </ul>
                        </div>

                        {integrations.find(i => i.type === 'SHOPIFY') ? (
                            <div className="flex space-x-3">
                                <button className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition text-sm font-medium">
                                    Settings
                                </button>
                                <button
                                    onClick={() => handleRemove(integrations.find(i => i.type === 'SHOPIFY').id)}
                                    className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition border border-red-400/20"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowConnectModal('SHOPIFY')}
                                className="w-full py-4 bg-[#95BF47] hover:bg-[#84ac3d] text-gray-900 rounded-xl transition font-bold shadow-lg shadow-[#95BF47]/20"
                            >
                                Connect Shopify Store
                            </button>
                        )}
                    </div>

                    {/* Amazon Card */}
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-[#FF9900]/10 rounded-2xl flex items-center justify-center border border-[#FF9900]/20">
                                    <ShoppingCart className="h-8 w-8 text-[#FF9900]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Amazon Seller</h3>
                                    <p className="text-gray-400 text-sm">SP-API connection for FBM/FBA</p>
                                </div>
                            </div>
                            {integrations.find(i => i.type === 'AMAZON') ? (
                                <span className="flex items-center space-x-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>CONNECTED</span>
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-xs font-bold border border-gray-600">
                                    NOT CONNECTED
                                </span>
                            )}
                        </div>

                        <div className="space-y-4 mb-8">
                            <ul className="text-sm text-gray-400 space-y-2">
                                <li className="flex items-center space-x-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                                    <span>Seller Central data bridge</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                                    <span>FBA inventory tracking</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                                    <span>Sales performance analytics</span>
                                </li>
                            </ul>
                        </div>

                        {integrations.find(i => i.type === 'AMAZON') ? (
                            <div className="flex space-x-3">
                                <button className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition text-sm font-medium">
                                    Settings
                                </button>
                                <button
                                    onClick={() => handleRemove(integrations.find(i => i.type === 'AMAZON').id)}
                                    className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition border border-red-400/20"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowConnectModal('AMAZON')}
                                className="w-full py-4 bg-[#FF9900] hover:bg-[#e68a00] text-gray-900 rounded-xl transition font-bold shadow-lg shadow-[#FF9900]/20"
                            >
                                Connect Amazon Account
                            </button>
                        )}
                    </div>
                </div>

                {/* Info Alert */}
                <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex items-start space-x-4">
                    <AlertCircle className="h-6 w-6 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-blue-400 mb-1">Automatic Webhook Sync</h4>
                        <p className="text-sm text-gray-400">Once connected, your store will automatically ping our servers whenever a new sale occurs. The &quot;Units Sold&quot; count on your dashboard will update in real-time without manual intervention.</p>
                    </div>
                </div>
            </main>

            {/* Connection Modal */}
            {showConnectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Connect {showConnectModal}</h3>
                            <button onClick={() => setShowConnectModal(null)} className="text-gray-400 hover:text-white transition">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleConnect} className="p-6 space-y-4">
                            {showConnectModal === 'SHOPIFY' ? (
                                <>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2">Shop URL</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="my-store.myshopify.com"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => setCredentials({ ...credentials, shop: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2">API Access Token</label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="shpat_..."
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => setCredentials({ ...credentials, accessToken: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2">Seller ID</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="A123456789BCDE"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => setCredentials({ ...credentials, sellerId: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2">Refresh Token</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => setCredentials({ ...credentials, refreshToken: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-bold mt-4"
                            >
                                Verify & Connect
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function IntegrationsPage() {
    return (
        <SocketProvider>
            <IntegrationsContent />
        </SocketProvider>
    );
}
