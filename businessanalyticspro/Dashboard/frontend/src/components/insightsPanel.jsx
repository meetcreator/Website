import React, { useMemo } from "react";
import { AlertTriangle, TrendingUp, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function InsightsPanel({ data }) {
  const insights = useMemo(() => {
    if (!data) return [];

    const results = [];

    // 1. Check for Missing Values (Critical)
    if (data.missing_values > 0) {
      const missingPct = data.missing_percentage || 0;
      if (missingPct > 10) {
        results.push({
          type: "critical",
          title: "High Missing Data",
          message: `${missingPct}% of records have missing values. This may impact analysis accuracy.`,
          action: "Clean Data",
          icon: AlertCircle,
        });
      } else {
        results.push({
          type: "warning",
          title: "Missing Values Detected",
          message: `Found ${data.missing_values} missing entries across the dataset.`,
          action: "Review",
          icon: AlertTriangle,
        });
      }
    }

    // 2. Check for Single Value Columns (Warning)
    if (data.statistics) {
      Object.entries(data.statistics).forEach(([col, stats]) => {
        if (stats.unique_values === 1) {
          results.push({
            type: "warning",
            title: "Redundant Column",
            message: `Column '${col}' has only 1 unique value. Consider dropping it.`,
            action: "Drop Column",
            icon: AlertTriangle,
          });
        }
      });
    }

    // 3. Check for Correlations (Info) - distinct from heatmap
    // We assume backend might provide top correlations, if not we skip or mock
    // For now we'll just check if we have enough numeric columns for correlation
    const numericCols = Object.values(data.statistics || {}).filter(
      (s) => s.dtype === "int64" || s.dtype === "float64"
    ).length;

    if (numericCols > 2) {
      results.push({
        type: "info",
        title: "Correlation Analysis Ready",
        message: `${numericCols} numeric columns detected. Check the Correlation Matrix for relationships.`,
        action: "View Heatmap",
        icon: TrendingUp,
      });
    }

    results.push({
      type: "success",
      title: "Data Successfully Profiled",
      message: `Analyzed ${data.rows} rows and ${data.columns} columns.`,
      action: "View Details",
      icon: CheckCircle,
    });

    return results;
  }, [data]);

  const severityStyles = {
    critical: "bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/20 dark:text-red-300",
    warning: "bg-amber-50 border-l-4 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
    info: "bg-blue-50 border-l-4 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    success: "bg-green-50 border-l-4 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  };

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          Automated Insights
        </h3>
        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
          {insights.length} Detected
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-r-lg transition-all hover:translate-x-1 ${severityStyles[insight.type]}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{insight.title}</h4>
                    <p className="text-sm opacity-90 mb-2">{insight.message}</p>
                    {insight.action && (
                      <button className="text-xs font-bold underline decoration-dotted hover:decoration-solid offset-2">
                        {insight.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
