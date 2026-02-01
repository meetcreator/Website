import { uploadFile, getDataProfile } from "../api";
import { useState } from "react";
import { Upload, File } from "lucide-react";

export default function UploadCard({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpload = async (file) => {
    if (!file) return;

    const validTypes = [".csv", ".xlsx", ".xls"];
    const isValid = validTypes.some((type) => file.name.toLowerCase().endsWith(type));

    if (!isValid) {
      setError("Invalid file type. Please upload CSV or Excel files only.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("File size exceeds 100MB limit.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const uploadResponse = await uploadFile(file);

      if (uploadResponse.data.status === "success") {
        setSuccess("File uploaded successfully! Analyzing data...");

        // Fetch profile data
        const profileResponse = await getDataProfile();
        onUploadSuccess(profileResponse.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || "Upload failed";
      setError(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-dashed transition-all duration-300 ${dragActive
            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
            : "border-gray-300 dark:border-gray-600"
          }`}
      >
        <input
          type="file"
          id="file-input"
          onChange={handleChange}
          accept=".csv,.xlsx,.xls"
          className="hidden"
          disabled={uploading}
        />

        <label
          htmlFor="file-input"
          className="flex flex-col items-center justify-center py-16 cursor-pointer"
        >
          <div className="mb-4">
            {uploading ? (
              <div className="animate-bounce">
                <File size={48} className="text-blue-600 dark:text-blue-400" />
              </div>
            ) : (
              <Upload size={48} className="text-gray-400 dark:text-gray-500" />
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {uploading ? "Uploading..." : "Drop your file here"}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            or click to select CSV, XLS, or XLSX files
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500">
            Maximum file size: 100MB
          </p>
        </label>

        {/* Loading Indicator */}
        {uploading && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-40 dark:bg-opacity-40 rounded-2xl flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Processing file...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl text-green-700 dark:text-green-300">
          <p className="font-medium">{success}</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "📊", title: "Instant Analysis", desc: "Get data profiling in seconds" },
          { icon: "🔄", title: "Auto Processing", desc: "Automatic data type detection" },
          { icon: "📈", title: "Visualize", desc: "Create charts and reports instantly" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{item.icon}</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
