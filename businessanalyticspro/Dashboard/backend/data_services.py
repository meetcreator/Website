import pandas as pd
import numpy as np
from config import CHART_COLORS, MAX_UNIQUE_VALUES_FOR_PIE, MAX_UNIQUE_VALUES_FOR_BAR
from scipy import stats as scipy_stats
import json

def profile_dataframe(df: pd.DataFrame) -> dict:
    """Generate comprehensive statistical profile of dataframe"""
    stats = {}
    
    for col in df.columns:
        col_data = {
            "dtype": str(df[col].dtype),
            "non_null_count": int(df[col].count()),
            "null_count": int(df[col].isnull().sum()),
            "unique_values": int(df[col].nunique()),
        }
        
        if pd.api.types.is_numeric_dtype(df[col]):
            col_data["statistics"] = {
                "mean": float(df[col].mean()) if not pd.isna(df[col].mean()) else None,
                "median": float(df[col].median()) if not pd.isna(df[col].median()) else None,
                "mode": float(df[col].mode().iloc[0]) if not df[col].mode().empty else None,
                "min": float(df[col].min()) if not pd.isna(df[col].min()) else None,
                "max": float(df[col].max()) if not pd.isna(df[col].max()) else None,
                "std": float(df[col].std()) if not pd.isna(df[col].std()) else None,
                "variance": float(df[col].var()) if not pd.isna(df[col].var()) else None,
                "q25": float(df[col].quantile(0.25)) if not pd.isna(df[col].quantile(0.25)) else None,
                "q75": float(df[col].quantile(0.75)) if not pd.isna(df[col].quantile(0.75)) else None,
            }
        else:
            col_data["statistics"] = {
                "mode": df[col].mode().iloc[0] if not df[col].mode().empty else None,
                "most_common_count": int(df[col].value_counts().iloc[0]) if not df[col].value_counts().empty else 0,
            }
        
        stats[col] = col_data
    
    return stats

def get_column_statistics(df: pd.DataFrame, column: str) -> dict:
    """Get detailed statistics for a specific column"""
    if column not in df.columns:
        raise ValueError(f"Column '{column}' not found in dataframe")
    
    col = df[column]
    stats = {
        "column": column,
        "dtype": str(col.dtype),
        "total_count": len(col),
        "non_null_count": int(col.count()),
        "null_count": int(col.isnull().sum()),
        "null_percentage": round((col.isnull().sum() / len(col) * 100), 2),
        "unique_values": int(col.nunique()),
    }
    
    if pd.api.types.is_numeric_dtype(col):
        stats.update({
            "mean": float(col.mean()),
            "median": float(col.median()),
            "mode": float(col.mode().iloc[0]) if not col.mode().empty else None,
            "std": float(col.std()),
            "variance": float(col.var()),
            "min": float(col.min()),
            "max": float(col.max()),
            "range": float(col.max() - col.min()),
            "q25": float(col.quantile(0.25)),
            "q50": float(col.quantile(0.50)),
            "q75": float(col.quantile(0.75)),
            "iqr": float(col.quantile(0.75) - col.quantile(0.25)),
            "skewness": float(scipy_stats.skew(col.dropna())),
            "kurtosis": float(scipy_stats.kurtosis(col.dropna())),
        })
    else:
        value_counts = col.value_counts().head(10).to_dict()
        stats["top_values"] = value_counts
    
    return stats

def get_descriptive_stats(df: pd.DataFrame, column: str) -> dict:
    """Alias for get_column_statistics for API consistency"""
    return get_column_statistics(df, column)

def get_chart_data(df: pd.DataFrame, chart_type: str, column: str = None) -> dict:
    """Generate data for different chart types"""
    
    if chart_type == "line":
        return _get_line_chart_data(df, column)
    elif chart_type == "bar":
        return _get_bar_chart_data(df, column)
    elif chart_type == "pie":
        return _get_pie_chart_data(df, column)
    elif chart_type == "histogram":
        return _get_histogram_data(df, column)
    elif chart_type == "scatter":
        return _get_scatter_data(df, column)
    else:
        raise ValueError(f"Unknown chart type: {chart_type}")

def _get_line_chart_data(df: pd.DataFrame, column: str = None) -> dict:
    """Generate line chart data"""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    
    if not numeric_cols:
        return {"labels": [], "datasets": []}
    
    if column and column in numeric_cols:
        columns_to_plot = [column]
    else:
        columns_to_plot = numeric_cols[:3]  # Limit to 3 columns
    
    labels = list(range(min(100, len(df))))  # Limit to 100 points
    datasets = []
    
    for idx, col in enumerate(columns_to_plot):
        datasets.append({
            "label": col,
            "data": df[col].head(100).fillna(0).tolist(),
            "borderColor": CHART_COLORS[idx % len(CHART_COLORS)],
            "fill": False,
            "tension": 0.4,
        })
    
    return {"labels": labels, "datasets": datasets}

def _get_bar_chart_data(df: pd.DataFrame, column: str = None) -> dict:
    """Generate bar chart data"""
    if column:
        if pd.api.types.is_numeric_dtype(df[column]):
            col_data = df[column].value_counts().head(MAX_UNIQUE_VALUES_FOR_BAR)
        else:
            col_data = df[column].value_counts().head(MAX_UNIQUE_VALUES_FOR_BAR)
    else:
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) == 0:
            col_data = df.iloc[:, 0].value_counts().head(MAX_UNIQUE_VALUES_FOR_BAR)
        else:
            col_data = df[numeric_cols[0]].value_counts().head(MAX_UNIQUE_VALUES_FOR_BAR)
    
    labels = [str(x) for x in col_data.index.tolist()]
    values = col_data.values.tolist()
    
    return {
        "labels": labels,
        "datasets": [{
            "label": column or "Count",
            "data": values,
            "backgroundColor": CHART_COLORS[:len(labels)],
        }]
    }

def _get_pie_chart_data(df: pd.DataFrame, column: str = None) -> dict:
    """Generate pie chart data"""
    if column:
        col_data = df[column].value_counts().head(MAX_UNIQUE_VALUES_FOR_PIE)
    else:
        col_data = df.iloc[:, 0].value_counts().head(MAX_UNIQUE_VALUES_FOR_PIE)
    
    labels = [str(x) for x in col_data.index.tolist()]
    values = col_data.values.tolist()
    
    return {
        "labels": labels,
        "datasets": [{
            "data": values,
            "backgroundColor": CHART_COLORS[:len(labels)],
        }]
    }

def _get_histogram_data(df: pd.DataFrame, column: str = None) -> dict:
    """Generate histogram data"""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    
    if not numeric_cols:
        return {"labels": [], "datasets": []}
    
    if column and column in numeric_cols:
        col = column
    else:
        col = numeric_cols[0]
    
    # Use 20 bins for histogram
    values = df[col].dropna()
    counts, bins = np.histogram(values, bins=20)
    
    labels = [f"{bins[i]:.2f}-{bins[i+1]:.2f}" for i in range(len(bins)-1)]
    
    return {
        "labels": labels,
        "datasets": [{
            "label": col,
            "data": counts.tolist(),
            "backgroundColor": CHART_COLORS[0],
        }]
    }

def _get_scatter_data(df: pd.DataFrame, column: str = None) -> dict:
    """Generate scatter plot data"""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    
    if len(numeric_cols) < 2:
        return {"datasets": []}
    
    x_col = numeric_cols[0]
    y_col = numeric_cols[1]
    
    data_points = []
    for idx, row in df.head(500).iterrows():
        data_points.append({
            "x": float(row[x_col]) if pd.notna(row[x_col]) else None,
            "y": float(row[y_col]) if pd.notna(row[y_col]) else None,
        })
    
    return {
        "datasets": [{
            "label": f"{x_col} vs {y_col}",
            "data": data_points,
            "backgroundColor": CHART_COLORS[0],
        }]
    }

def get_correlation_matrix(df: pd.DataFrame) -> dict:
    """Generate correlation matrix for numeric columns"""
    numeric_df = df.select_dtypes(include=[np.number])
    
    if numeric_df.shape[1] == 0:
        return {"columns": [], "values": []}
    
    correlation = numeric_df.corr()
    
    return {
        "columns": correlation.columns.tolist(),
        "values": correlation.values.tolist(),
        "data": {
            col1: {
                col2: float(correlation.loc[col1, col2])
                for col2 in correlation.columns
            }
            for col1 in correlation.columns
        }
    }

def clean_dataframe(df: pd.DataFrame, action: str, column: str = None) -> pd.DataFrame:
    """Apply data cleaning operations"""
    
    if action == "remove_nulls":
        return df.dropna()
    
    elif action == "remove_nulls_column" and column:
        return df.dropna(subset=[column])
    
    elif action == "fill_nulls_mean" and column:
        if pd.api.types.is_numeric_dtype(df[column]):
            df[column] = df[column].fillna(df[column].mean())
        return df
    
    elif action == "fill_nulls_median" and column:
        if pd.api.types.is_numeric_dtype(df[column]):
            df[column] = df[column].fillna(df[column].median())
        return df
    
    elif action == "fill_nulls_forward":
        return df.ffill()
    
    elif action == "fill_nulls_backward":
        return df.bfill()
    
    elif action == "fill_nulls_zero":
        return df.fillna(0)
    
    elif action == "remove_duplicates":
        return df.drop_duplicates()
    
    elif action == "remove_duplicates_column" and column:
        return df.drop_duplicates(subset=[column])
    
    elif action == "reset_index":
        return df.reset_index(drop=True)
    
    elif action == "remove_column" and column:
        return df.drop(columns=[column])
    
    else:
        raise ValueError(f"Unknown cleaning action: {action}")

def export_to_csv(df: pd.DataFrame, filepath: str) -> None:
    """Export dataframe to CSV"""
    df.to_csv(filepath, index=False)

def export_to_excel(df: pd.DataFrame, filepath: str) -> None:
    """Export dataframe to Excel"""
    df.to_excel(filepath, index=False)
