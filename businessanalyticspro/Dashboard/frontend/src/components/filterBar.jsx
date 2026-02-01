import React from "react";
import { Calendar, Filter, RotateCcw, Save } from "lucide-react";

export default function FilterBar() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
                {/* Date Range Picker Mockup */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Calendar size={16} />
                        <span>Last 30 Days</span>
                    </button>
                </div>

                {/* Region / Category Filter Mockup */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Region:</span>
                    <select className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all">
                        <option>All Regions</option>
                        <option>North America</option>
                        <option>Europe</option>
                        <option>Asia Pacific</option>
                    </select>
                </div>

                {/* Segment Filter Mockup */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Segment:</span>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Filter size={16} />
                        <span>3 Selected</span>
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Reset Filters">
                    <RotateCcw size={18} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-sm">
                    <Save size={16} />
                    <span>Save View</span>
                </button>
            </div>
        </div>
    );
}
