import os

# File upload configuration
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

# API configuration
API_TITLE = "Business Analytics API"
API_VERSION = "1.0.0"

# CORS configuration
ALLOWED_ORIGINS = [
    "*",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://websitess-pi.vercel.app",
]

# Chart configuration
CHART_COLORS = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", 
    "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"
]

# Data processing configuration
MISSING_VALUE_THRESHOLD = 0.5  # 50% threshold for considering a column as mostly missing
MAX_UNIQUE_VALUES_FOR_PIE = 10
MAX_UNIQUE_VALUES_FOR_BAR = 20
