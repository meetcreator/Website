import { useState, useEffect } from "react";
import { Plus, Trash2, Search, X, RefreshCw } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function BusinessManager({ category, title, idField }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({});
    const [columns, setColumns] = useState([]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/business/${category}`);
            setItems(response.data);
            if (response.data.length > 0) {
                setColumns(Object.keys(response.data[0]));
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [category]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await axios.delete(`${API_URL}/business/${category}/${idField}/${id}`);
            fetchItems();
        } catch (error) {
            alert("Failed to delete item");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/business/${category}`, newItem);
            setIsModalOpen(false);
            setNewItem({});
            fetchItems();
        } catch (error) {
            alert("Failed to add item");
        }
    };

    const getStats = () => {
        if (!items.length) return [];

        const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

        if (category === "goods") {
            const totalValue = items.reduce((acc, item) => acc + (parseFloat(item.price || 0) * parseFloat(item.stock || 0)), 0);
            const lowStock = items.filter(i => parseInt(i.stock) < parseInt(i.min_stock_level || 10)).length;
            return [
                { label: "Total Inventory Value", value: formatCurrency(totalValue), color: "blue" },
                { label: "Total Items", value: items.reduce((acc, i) => acc + parseInt(i.stock || 0), 0), color: "purple" },
                { label: "Low Stock Alerts", value: lowStock, color: "red" }
            ];
        }
        if (category === "vendors") {
            const avgRating = items.reduce((acc, i) => acc + parseFloat(i.rating || 0), 0) / items.length;
            return [
                { label: "Total Vendors", value: items.length, color: "blue" },
                { label: "Average Rating", value: avgRating.toFixed(1) + " / 5.0", color: "orange" },
                { label: "Active Contracts", value: items.filter(i => i.status === "Active").length, color: "green" }
            ];
        }
        if (category === "employees") {
            const totalPayroll = items.reduce((acc, i) => acc + parseFloat(i.salary || 0), 0);
            return [
                { label: "Total Headcount", value: items.length, color: "blue" },
                { label: "Annual Payroll", value: formatCurrency(totalPayroll), color: "green" },
                { label: "Avg Salary", value: formatCurrency(totalPayroll / items.length), color: "purple" }
            ];
        }
        return [];
    };

    const stats = getStats();

    const filteredItems = items.filter((item) =>
        Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center card-neumorphic p-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage your {title.toLowerCase()}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-neumorphic flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add New
                </button>
            </div>
            {/* Analytics Panel */}
            {stats.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="card-neumorphic border-l-4 border-l-neo-accent">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="card-neumorphic p-6">
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input-neumorphic pl-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchItems}
                        className="p-3 rounded-xl shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo dark:hover:shadow-neo-dark hover:-translate-y-0.5 transition-all text-gray-600 dark:text-gray-300"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    {columns.map((col) => (
                                        <th key={col} className="p-4 font-semibold text-gray-600 dark:text-gray-300 capitalize">
                                            {col.replace(/_/g, " ")}
                                        </th>
                                    ))}
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        {columns.map((col) => (
                                            <td key={col} className="p-4 text-gray-700 dark:text-gray-300">
                                                {item[col]}
                                            </td>
                                        ))}
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(item[idField])}
                                                className="p-2 rounded-xl text-red-500 shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo-in dark:hover:shadow-neo-dark-in transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredItems.length === 0 && (
                            <div className="text-center py-12 text-gray-500">No items found</div>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="card-neumorphic p-8 w-full max-w-lg m-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold dark:text-white">Add New {title}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-xl text-gray-500 shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo-in dark:hover:shadow-neo-dark-in transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            {columns.map((col) => (
                                <div key={col}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                                        {col.replace(/_/g, " ")}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input-neumorphic"
                                        value={newItem[col] || ""}
                                        onChange={(e) => setNewItem({ ...newItem, [col]: e.target.value })}
                                    />
                                </div>
                            ))}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300 font-medium shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo dark:hover:shadow-neo-dark transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-neumorphic flex-1"
                                >
                                    Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
