import React from "react";

export default function ColumnProfile({ data }) {
    if (!data || !data.statistics) return null;

    return (
        <div className="card-neumorphic mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                📈 Column-wise Statistical Summary
            </h3>
            <div className="space-y-4">
                {Object.entries(data.statistics).map(([col, stats]) => (
                    <div
                        key={col}
                        className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent p-4 rounded-lg"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {col}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Type:{" "}
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        {stats.dtype}
                                    </span>
                                </p>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-full">
                                {((stats.non_null_count / (data.rows || 1)) * 100).toFixed(1)}%
                                Complete
                            </span>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            <div className="text-center p-2 bg-white dark:bg-gray-700/50 rounded">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Non-null
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {stats.non_null_count}
                                </p>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-gray-700/50 rounded">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Unique
                                </p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {stats.unique_values}
                                </p>
                            </div>
                            {stats.mean !== undefined && (
                                <div className="text-center p-2 bg-white dark:bg-gray-700/50 rounded">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Mean
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {parseFloat(stats.mean).toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {stats.min !== undefined && (
                                <div className="text-center p-2 bg-white dark:bg-gray-700/50 rounded">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Min
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {parseFloat(stats.min).toFixed(2)}
                                    </p>
                                </div>
                            )}
                            {stats.max !== undefined && (
                                <div className="text-center p-2 bg-white dark:bg-gray-700/50 rounded">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Max
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {parseFloat(stats.max).toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {stats.missing_count > 0 && (
                            <div className="mt-2 p-2 bg-orange-100 dark:bg-orange-900/30 rounded">
                                <p className="text-xs text-orange-800 dark:text-orange-300">
                                    ⚠️ Missing values:{" "}
                                    <span className="font-bold">{stats.missing_count}</span>
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
