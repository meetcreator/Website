
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket, SocketProvider } from '@/context/SocketContext';
import { Activity, Users, Box, TrendingUp, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock initial data - in real app, fetch from API
const initialChartData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
];

function DashboardContent() {
    const router = useRouter();
    const { socket, isConnected } = useSocket();
    const [chartData, setChartData] = useState(initialChartData);
    const [activities, setActivities] = useState<any[]>([]);
    const [newItemName, setNewItemName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        if (socket) {
            socket.on('dataUpdated', (data: any) => {
                console.log('Realtime update received:', data);
                // Add new activity
                setActivities((prev) => [
                    { id: Date.now(), text: `New item added: ${data.name}`, time: new Date().toLocaleTimeString() },
                    ...prev.slice(0, 9), // Keep last 10
                ]);

                // Update chart data randomly for demo effect if data has value, or just verify socket works
                if (data.value) {
                    setChartData((prev) => [
                        ...prev.slice(1),
                        { name: 'New', value: data.value }
                    ]);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('dataUpdated');
            }
        };
    }, [socket, router]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        router.push('/admin/login');
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim() || !socket) return;

        setLoading(true);

        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const tenantId = user?.tenantId || 'demo-tenant';

        socket.emit('createItem', {
            name: newItemName,
            value: Math.floor(Math.random() * 5000) + 1000,
            tenantId: tenantId
        });

        setNewItemName('');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Sidebar / Navigation */}
            <nav className="fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 p-6 hidden md:block">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">Admin Panel</span>
                </div>

                <div className="space-y-4">
                    <button onClick={() => router.push('/admin/dashboard')} className="flex items-center space-x-3 w-full p-3 bg-gray-700/50 text-blue-400 rounded-lg text-left">
                        <Box className="h-5 w-5" />
                        <span>Dashboard</span>
                    </button>
                    <button onClick={() => router.push('/admin/dashboard/integrations')} className="flex items-center space-x-3 w-full p-3 hover:bg-gray-700/30 text-gray-400 rounded-lg transition text-left">
                        <ShoppingCart className="h-5 w-5" />
                        <span>Integrations</span>
                    </button>
                    <button className="flex items-center space-x-3 w-full p-3 hover:bg-gray-700/30 text-gray-400 rounded-lg transition text-left">
                        <Users className="h-5 w-5" />
                        <span>Users</span>
                    </button>
                    <button className="flex items-center space-x-3 w-full p-3 hover:bg-gray-700/30 text-gray-400 rounded-lg transition text-left">
                        <Activity className="h-5 w-5" />
                        <span>Activity</span>
                    </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                        <span className="text-sm text-gray-400">{isConnected ? 'System Online' : 'Connecting...'}</span>
                    </div>
                    <button onClick={handleLogout} className="w-full py-2 bg-red-600/10 text-red-400 hover:bg-red-600/20 rounded-lg transition">
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Realtime Overview</h2>
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                            <span className="text-gray-400 text-sm">Last Sync: </span>
                            <span className="text-blue-400 text-sm font-mono">Just now</span>
                        </div>
                        <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
                            <span className="font-bold text-sm">AD</span>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Users className="text-blue-400 h-6 w-6" />
                            </div>
                            <span className="text-green-400 text-sm font-medium">+12%</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">1,234</h3>
                        <p className="text-gray-400 text-sm">Active Users</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <Box className="text-purple-400 h-6 w-6" />
                            </div>
                            <span className="text-green-400 text-sm font-medium">+5%</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">456</h3>
                        <p className="text-gray-400 text-sm">Total Products</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <TrendingUp className="text-green-400 h-6 w-6" />
                            </div>
                            <span className="text-green-400 text-sm font-medium">+24%</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">$89,234</h3>
                        <p className="text-gray-400 text-sm">Total Revenue</p>
                    </div>
                </div>

                {/* Charts and Inputs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h3 className="text-lg font-bold mb-6">User Activity Trends</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#60A5FA" strokeWidth={3} dot={{ r: 4, fill: '#2563EB' }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                        <form onSubmit={handleAddItem} className="space-y-4 mb-8">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Add New Data Item</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter item name..."
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !newItemName}
                                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition disabled:opacity-50"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </form>

                        <h3 className="text-lg font-bold mb-4 border-t border-gray-700 pt-4">Recent Live Activity</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {activities.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
                            ) : (
                                activities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg animate-fade-in">
                                        <div className="h-2 w-2 mt-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                                        <div>
                                            <p className="text-sm text-gray-200">{activity.text}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <SocketProvider>
            <DashboardContent />
        </SocketProvider>
    );
}
