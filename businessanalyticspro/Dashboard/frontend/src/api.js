import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://business-analytics-backend.onrender.com";

console.log("Current API_BASE_URL:", API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // Increased to 180 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Add error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Details:", {
      message: error.message,
      config: error.config,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

// File Upload API
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get Data Profile
export const getDataProfile = async () => {
  return api.get("/profile");
};

// Get Paginated Data
export const getData = async (page = 1, perPage = 25) => {
  return api.get("/data", {
    params: { page, per_page: perPage },
  });
};

// Get Chart Data
// Get Chart Data
export const getChartData = async (chartType, column = null, source = "upload") => {
  return api.get("/chart-data", {
    params: { chart_type: chartType, column, source },
  });
};

// Get Correlation Matrix
export const getCorrelation = async () => {
  return api.get("/correlation");
};

// Get Descriptive Stats
export const getDescriptiveStats = async (column) => {
  return api.get("/descriptive-stats", {
    params: { column },
  });
};

// Clean Data
export const cleanData = async (action, column = null) => {
  return api.post("/clean-data", { action, column });
};

// Reset Data
export const resetData = async () => {
  return api.post("/reset-data");
};

// Export CSV
export const exportCSV = async () => {
  return api.get("/export-csv");
};

// Health Check
export const healthCheck = async () => {
  return api.get("/health");
};
