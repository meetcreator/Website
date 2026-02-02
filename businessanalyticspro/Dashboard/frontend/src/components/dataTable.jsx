import { useEffect, useState } from "react";
import { getData, cleanData, resetData } from "../api";
import { ChevronUp, ChevronDown, Download, RotateCcw, Trash2 } from "lucide-react";

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (pageNum) => {
    setLoading(true);
    try {
      const res = await getData(pageNum, 25);
      setRows(res.data.data || []);
      setTotalPages(res.data.total_pages || 1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleCleanData = async (action) => {
    setActionLoading(true);
    try {
      await cleanData(action, selectedColumn);
      await fetchData(page);
      alert(`Data cleaning action '${action}' applied successfully!`);
    } catch (error) {
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset to original data?")) return;
    setActionLoading(true);
    try {
      await resetData();
      await fetchData(page);
      alert("Data reset to original state");
    } catch (error) {
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="card-neumorphic text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const columns = Object.keys(rows[0] || {});

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="card-neumorphic">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Data Tools</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCleanData("remove_nulls")}
            disabled={actionLoading}
            className="px-4 py-2 rounded-xl shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo dark:hover:shadow-neo-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-red-600 dark:text-red-400 font-medium"
          >
            <Trash2 className="inline mr-2" size={16} />
            Remove Nulls
          </button>
          <button
            onClick={() => handleCleanData("remove_duplicates")}
            disabled={actionLoading}
            className="px-4 py-2 rounded-xl shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo dark:hover:shadow-neo-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-orange-600 dark:text-orange-400 font-medium"
          >
            <Trash2 className="inline mr-2" size={16} />
            Remove Duplicates
          </button>
          <button
            onClick={() => handleCleanData("fill_nulls_zero")}
            disabled={actionLoading}
            className="px-4 py-2 rounded-xl shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo dark:hover:shadow-neo-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-yellow-600 dark:text-yellow-400 font-medium"
          >
            Fill Nulls
          </button>
          <button
            onClick={handleReset}
            disabled={actionLoading}
            className="px-4 py-2 rounded-xl shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo dark:hover:shadow-neo-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-neo-accent font-medium"
          >
            <RotateCcw className="inline mr-2" size={16} />
            Reset Data
          </button>
          <button
            className="px-4 py-2 rounded-xl shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo dark:hover:shadow-neo-dark hover:-translate-y-0.5 transition-all text-green-600 dark:text-green-400 font-medium"
          >
            <Download className="inline mr-2" size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="card-neumorphic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                {columns.map((col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-150 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate">{col}</span>
                      {sortConfig.key === col && (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={`${idx}-${col}`}
                      className="px-6 py-3 text-gray-700 dark:text-gray-300"
                    >
                      {String(row[col] ?? "-").substring(0, 50)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="card-neumorphic flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-6 py-2 rounded-xl shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo dark:hover:shadow-neo-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 dark:text-gray-200"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-6 py-2 rounded-xl shadow-neo-sm dark:shadow-neo-dark-sm hover:shadow-neo dark:hover:shadow-neo-dark hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 dark:text-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
