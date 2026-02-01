# 📊 TINMCO BUSINESS - Complete Web Application

A production-ready business analytics dashboard built with **React.js**, **Tailwind CSS (Neumorphism)**, and **FastAPI**. Featuring interactive charts, data profiling, and comprehensive analysis tools.

## ✨ Features

### 🎨 Modern UI/UX
- **Neumorphism Design**: Soft shadows, light gradients, rounded cards
- **Dark & Light Mode**: Toggle between themes
- **Responsive Layout**: Desktop & tablet optimized
- **Interactive Components**: Smooth animations and transitions

### 📈 Dashboard Features
- **KPI Cards**: Total Rows, Columns, Missing Values, File Size
- **Interactive Charts**:
  - Line Chart
  - Bar Chart
  - Pie Chart
  - Histogram
- **Correlation Heatmap**: Analyze relationships between numeric columns
- **Data Table**: With pagination, sorting, and search
- **Tab Navigation**: Overview, Charts, Correlation, Data

### 📁 File Upload & Analysis
- **Drag & Drop**: Easy file upload
- **Multiple Formats**: CSV, XLS, XLSX support
- **Auto Data Profiling**:
  - Column types detection
  - Null values analysis
  - Statistical measures (Mean, Median, Mode, Min, Max, Std Dev)
  - Unique value counts

### 🛠️ Data Cleaning Tools
- Remove null values
- Remove duplicates
- Fill null values (mean, median, forward fill, backward fill, zero)
- Reset to original data
- Export to CSV

### 🔒 Backend API
- RESTful API with FastAPI
- CORS enabled for frontend integration
- Comprehensive error handling
- Type validation with Pydantic
- File upload support (100MB max)

## 🚀 Tech Stack

### Frontend
- **React.js 18.2**: Modern UI framework
- **Tailwind CSS 3.3**: Utility-first styling with neumorphism
- **Recharts**: Interactive charts and graphs
- **Axios**: HTTP client
- **Lucide React**: Modern icons
- **Vite 5.0**: Lightning-fast build tool

### Backend
- **FastAPI 0.104**: Modern Python web framework
- **Uvicorn 0.24**: ASGI server
- **Pandas 2.1**: Data manipulation
- **NumPy 1.26**: Numerical computing
- **SciPy 1.11**: Statistical computations
- **Pydantic 2.5**: Data validation
- **Python-multipart**: File upload support

## 📁 Project Structure

```
Dashboard/
├── backend/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration settings
│   ├── data_services.py        # Data processing utilities
│   ├── schemas.py              # Pydantic models
│   ├── requirements.txt        # Python dependencies
│   ├── .gitignore
│   └── uploads/                # Uploaded files directory
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Main app component
│   │   ├── api.js              # API client
│   │   ├── styles.css          # Global styles & neumorphism
│   │   └── components/
│   │       ├── navbar.jsx      # Top navigation
│   │       ├── sidebar.jsx     # Side navigation
│   │       ├── uploadcard.jsx  # File upload component
│   │       ├── kpicard.jsx     # KPI metrics display
│   │       ├── dataTable.jsx   # Data table with pagination
│   │       ├── chartSection.jsx # Chart visualization
│   │       └── correlationMatrix.jsx # Heatmap
│   │
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── package.json            # Node dependencies
│   ├── .env                    # Environment variables
│   └── .gitignore
│
└── README.md                   # This file
```

## 🔧 Installation & Setup

### Prerequisites
- **Node.js 16+** and **npm/yarn**
- **Python 3.9+** and **pip**
- Modern web browser

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd Dashboard/backend
   ```

2. **Create virtual environment**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create uploads directory** (if not exists):
   ```bash
   mkdir uploads
   ```

5. **Run the FastAPI server**:
   ```bash
   python main.py
   ```
   
   Or with uvicorn:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`
   - Alternative Docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd Dashboard/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📊 API Endpoints

### File Upload
- **POST** `/upload` - Upload CSV/XLS/XLSX file
  - Response: File metadata

### Data Profiling
- **GET** `/profile` - Get comprehensive data profile
  - Response: Rows, columns, missing values, statistics
- **GET** `/data?page=1&per_page=25` - Get paginated data
  - Response: Data records with pagination info

### Charts & Analysis
- **GET** `/chart-data?chart_type=line&column=name` - Get chart data
  - Supported types: `line`, `bar`, `pie`, `histogram`, `scatter`
- **GET** `/correlation` - Get correlation matrix
  - Response: Correlation data for numeric columns
- **GET** `/descriptive-stats?column=name` - Get column statistics
  - Response: Detailed statistics for specific column

### Data Cleaning
- **POST** `/clean-data` - Apply data cleaning
  - Actions: `remove_nulls`, `fill_nulls_zero`, `remove_duplicates`, etc.
- **POST** `/reset-data` - Reset to original data
- **GET** `/export-csv` - Export current data as CSV

### Health Check
- **GET** `/health` - API health status

## 🎨 Design Features

### Neumorphism Styling
- **Soft Shadows**: Subtle depth without harsh contrast
- **Light Gradients**: Smooth color transitions
- **Rounded Cards**: Modern, friendly appearance
- **Responsive Grid**: Adapts to all screen sizes

### Dark Mode
- Automatic theme detection
- Smooth transitions
- Optimized colors for both modes
- Toggle in navbar

## 📝 Usage Guide

### 1. Upload Data
- Drag and drop a file or click to select
- Supported formats: CSV, XLS, XLSX
- Maximum file size: 100MB

### 2. View Dashboard
- **Overview Tab**: KPI metrics and statistics
- **Charts Tab**: Interactive visualizations
- **Correlation Tab**: Heatmap of relationships
- **Data Tab**: Full data table with tools

### 3. Data Analysis
- Select different chart types
- Choose columns to visualize
- View correlation between numeric columns
- Export data as CSV

### 4. Data Cleaning
- Remove null values
- Remove duplicates
- Fill null values with various methods
- Reset to original data anytime

## 🔐 Security Considerations

- CORS enabled for frontend integration
- File type validation on upload
- File size limits (100MB max)
- Pydantic validation for all inputs
- Input sanitization

## 🚀 Performance Optimization

- Lazy loading of components
- Efficient data pagination
- Optimized chart rendering
- CSS minification in production
- JS bundling with Vite

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Backend (change port)
uvicorn main:app --port 8001

# Frontend (change port)
npm run dev -- --port 5174
```

### CORS Errors
- Ensure backend is running on `http://localhost:8000`
- Check `.env` file in frontend directory
- Verify API URL in `api.js`

### File Upload Issues
- Check file size (max 100MB)
- Verify file format (CSV, XLS, XLSX)
- Ensure `uploads/` directory exists

### Dependencies Issues
```bash
# Backend
pip install -r requirements.txt --upgrade

# Frontend
npm install
npm update
```

## 📦 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend (config.py)
```python
UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}
MAX_FILE_SIZE = 100 * 1024 * 1024
```

## 🎯 Future Enhancements

- [ ] User authentication & authorization
- [ ] Database integration
- [ ] Advanced filtering options
- [ ] Real-time collaboration
- [ ] Data export to multiple formats (JSON, PDF)
- [ ] Machine learning predictions
- [ ] Custom report generation
- [ ] API rate limiting
- [ ] Advanced caching
- [ ] WebSocket support

## 📄 License

MIT License - Feel free to use this project for personal and commercial purposes.

## 👥 Support

For issues, questions, or contributions, please open an issue on the repository.

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Pandas Documentation](https://pandas.pydata.org/docs)
- [Recharts Documentation](https://recharts.org)

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready ✅
