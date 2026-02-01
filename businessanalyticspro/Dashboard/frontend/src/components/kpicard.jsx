import React from "react";
import { BarChart3, Database, Zap, FileText } from "lucide-react";

export default function KPICard({ data }) {
  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Rows",
      value: data.rows?.toLocaleString() || 0,
      icon: Database,
      color: "blue",
      description: "Records in dataset",
    },
    {
      title: "Columns",
      value: data.columns?.toLocaleString() || 0,
      icon: FileText,
      color: "purple",
      description: "Data fields",
    },
    {
      title: "Missing Values",
      value: data.missing_values?.toLocaleString() || 0,
      icon: Zap,
      color: "orange",
      description: `${data.missing_percentage || 0}% of data`,
    },
    {
      title: "File Size",
      value: `${data.file_size_kb || 0} KB`,
      icon: BarChart3,
      color: "green",
      description: "Memory usage",
    },
  ];

  const colorVariants = {
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
    orange: "from-orange-400 to-orange-600",
    green: "from-green-400 to-green-600",
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colorVariants[kpi.color]} text-white`}>
                  <Icon size={24} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {kpi.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {kpi.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{kpi.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
