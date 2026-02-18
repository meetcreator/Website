import { useState, useEffect } from "react";
import { getChartData, getDataProfile } from "../api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CHART_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
];

export default function ChartSection() {
  const [chartType, setChartType] = useState("line");
  const [source, setSource] = useState("upload");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartStats, setChartStats] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Fetch available columns based on source
    if (source === "upload") {
      getDataProfile()
        .then((res) => {
          setColumns(res.data.column_names || []);
          if (res.data.column_names?.length > 0) setSelectedColumn(res.data.column_names[0]);
          setLoading(false);
        })
        .catch((err) => { console.error("Error fetching columns:", err); setLoading(false); });
    } else {
      // Fetch from business API
      import("axios").then(axios => {
        const API_URL = import.meta.env.VITE_API_URL || "https://website-zw0o.onrender.com";
        axios.default.get(`${API_URL}/business/${source}`)
          .then(res => {
            if (res.data.length > 0) {
              const cols = Object.keys(res.data[0]);
              setColumns(cols);
              setSelectedColumn(cols[0]);
            } else {
              setColumns([]);
              setSelectedColumn(null);
            }
            setLoading(false);
          })
          .catch(err => { console.error(err); setLoading(false); });
      });
    }
  }, [source]);

  useEffect(() => {
    if (!selectedColumn) return;

    setLoading(true);
    getChartData(chartType, selectedColumn, source)
      .then((res) => {
        setChartData(res.data.data);

        // Calculate statistics
        const data = res.data.data?.datasets?.[0]?.data || [];
        if (data.length > 0) {
          const values = data.filter(v => typeof v === 'number');
          const sum = values.reduce((a, b) => a + b, 0);
          const avg = sum / values.length;
          const sorted = [...values].sort((a, b) => a - b);
          const median = sorted[Math.floor(sorted.length / 2)];
          const min = Math.min(...values);
          const max = Math.max(...values);
          const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / values.length);

          setChartStats({
            count: values.length,
            mean: avg.toFixed(2),
            median: median.toFixed(2),
            min: min.toFixed(2),
            max: max.toFixed(2),
            stdDev: stdDev.toFixed(2),
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
        setLoading(false);
      });
  }, [chartType, selectedColumn, source]);

  const renderChart = () => {
    if (!chartData || loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading chart...</p>
          </div>
        </div>
      );
    }

    const data = chartData.data || chartData;

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartData.datasets?.map((dataset, idx) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={dataset.borderColor}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.datasets?.[0]?.data?.map((val, idx) => ({
              name: chartData.labels?.[idx],
              value: val,
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={CHART_COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData.labels?.map((label, idx) => ({
                  name: label,
                  value: chartData.datasets?.[0]?.data?.[idx] || 0,
                })) || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.labels?.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "histogram":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.labels?.map((label, idx) => ({
              range: label,
              count: chartData.datasets?.[0]?.data?.[idx] || 0,
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={CHART_COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="card-neumorphic">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Chart Visualization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Data Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full input-neumorphic"
            >
              <option value="upload">Uploaded File</option>
              <option value="goods">Inventory (Goods)</option>
              <option value="vendors">Vendors</option>
              <option value="employees">Employees</option>
            </select>
          </div>

          {/* Chart Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chart Type
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full input-neumorphic"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="histogram">Histogram</option>
            </select>
          </div>

          {/* Column Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Column
            </label>
            <select
              value={selectedColumn || ""}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full input-neumorphic"
            >
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="card-neumorphic">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 capitalize">
          {chartType} Chart
        </h3>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          {renderChart()}
        </div>
      </div>

      {/* Chart Statistics */}
      {chartStats && (
        <div className="card-neumorphic">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            📊 Statistical Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Count</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{chartStats.count}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Mean</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">{chartStats.mean}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Median</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{chartStats.median}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Std Dev</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">{chartStats.stdDev}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Min</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{chartStats.min}</p>
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg border-l-4 border-cyan-500">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Max</p>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">{chartStats.max}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
