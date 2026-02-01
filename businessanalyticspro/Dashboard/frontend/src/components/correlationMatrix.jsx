import { useState, useEffect } from "react";
import { getCorrelation } from "../api";
import { ChevronDown } from "lucide-react";

export default function CorrelationMatrix() {
  const [correlationData, setCorrelationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPair, setSelectedPair] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCorrelation()
      .then((res) => {
        setCorrelationData(res.data.data || res.data.correlation);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching correlation:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading correlation matrix...</p>
        </div>
      </div>
    );
  }

  if (!correlationData || Object.keys(correlationData).length === 0) {
    return (
      <div className="card-neumorphic text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No numeric columns available for correlation analysis
        </p>
      </div>
    );
  }

  const columns = Object.keys(correlationData);
  const matrixData = [];

  columns.forEach((col1) => {
    columns.forEach((col2) => {
      let value = correlationData[col1]?.[col2] ?? 0;
      // Ensure value is a number
      value = typeof value === 'number' ? value : parseFloat(value) || 0;
      matrixData.push({
        col1,
        col2,
        value: parseFloat(value.toFixed(3)),
      });
    });
  });

  const getColor = (value) => {
    // Red for negative, blue for positive
    if (value < 0) {
      return `rgb(255, ${Math.floor(100 + value * 155)}, 100)`;
    } else {
      return `rgb(100, ${Math.floor(100 + value * 155)}, 255)`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-neumorphic">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Correlation Heatmap
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Shows correlation between numeric columns (values from -1 to 1)
        </p>

        {/* Heatmap Table */}
        <div className="overflow-x-auto">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="p-3 border dark:border-gray-600"></th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="p-3 border dark:border-gray-600 text-xs font-semibold text-gray-900 dark:text-white text-center"
                    style={{ minWidth: "100px" }}
                  >
                    <div className="transform -rotate-45 origin-center whitespace-nowrap text-xs">{col}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {columns.map((col1) => (
                <tr key={col1}>
                  <td className="p-3 border dark:border-gray-600 text-xs font-semibold text-gray-900 dark:text-white sticky left-0 bg-gray-50 dark:bg-gray-700">
                    {col1}
                  </td>
                  {columns.map((col2) => {
                    let value = correlationData[col1]?.[col2] ?? 0;
                    // Ensure value is a number
                    value = typeof value === 'number' ? value : parseFloat(value) || 0;
                    const isSelected = selectedPair?.col1 === col1 && selectedPair?.col2 === col2;
                    return (
                      <td
                        key={`${col1}-${col2}`}
                        onClick={() => setSelectedPair({ col1, col2, value })}
                        className={`p-3 border dark:border-gray-600 text-xs font-bold text-center cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: getColor(value),
                          color: Math.abs(value) > 0.5 ? "white" : "black",
                          minWidth: "100px",
                        }}
                        title={`${col1} vs ${col2}: ${value.toFixed(3)}`}
                      >
                        {value.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "rgb(255, 100, 100)" }}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Negative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "rgb(180, 180, 255)" }}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Weak</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: "rgb(100, 200, 255)" }}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Positive</span>
          </div>
        </div>

        {/* Selected Pair Details */}
        {selectedPair && selectedPair.col1 !== selectedPair.col2 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-lg">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
              ✓ Selected: <span className="text-blue-600 dark:text-blue-400">{selectedPair.col1}</span> ↔ <span className="text-blue-600 dark:text-blue-400">{selectedPair.col2}</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Correlation</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedPair.value.toFixed(3)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Strength</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {Math.abs(selectedPair.value) > 0.7 ? "🔴 Strong" : Math.abs(selectedPair.value) > 0.4 ? "🟡 Moderate" : "🟢 Weak"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Direction</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedPair.value > 0 ? "📈 Positive" : selectedPair.value < 0 ? "📉 Negative" : "➡️ None"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">R² Value</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {(Math.pow(selectedPair.value, 2) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
              💡 {Math.abs(selectedPair.value) > 0.7 ? "These variables are strongly related. Changes in one tend to predict changes in the other." : Math.abs(selectedPair.value) > 0.4 ? "These variables show moderate relationship. Some patterns visible between them." : "These variables show weak or no relationship. They vary independently."}
            </p>
          </div>
        )}
      </div>

      {/* Top Correlations */}
      <div className="card-neumorphic">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          🔗 Top Correlations
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Strongest relationships between column pairs</p>
        <div className="space-y-2">
          {matrixData
            .filter((d) => d.col1 !== d.col2)
            .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
            .slice(0, 10)
            .map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPair(item)}
                className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border-l-4 hover:shadow-md transition-all cursor-pointer"
                style={{
                  borderLeftColor: item.value < 0 ? "#ff6464" : "#6e96ff",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.col1} ↔ {item.col2}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {Math.abs(item.value) > 0.7 ? "🔴 Strong" : Math.abs(item.value) > 0.4 ? "🟡 Moderate" : "🟢 Weak"} {item.value > 0 ? "positive" : "negative"} correlation
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: item.value < 0 ? "#ff6464" : "#6e96ff" }}>
                      {item.value.toFixed(3)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">R²: {(Math.pow(item.value, 2) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
