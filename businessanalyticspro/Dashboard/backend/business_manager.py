
import os
import pandas as pd
from datetime import datetime
from typing import List, Dict, Any, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

class DataManager:
    def __init__(self):
        os.makedirs(DATA_DIR, exist_ok=True)
        self.files = {
            "goods": os.path.join(DATA_DIR, "goods.csv"),
            "vendors": os.path.join(DATA_DIR, "vendors.csv"),
            "employees": os.path.join(DATA_DIR, "employees.csv")
        }

    def _read_csv(self, file_type: str) -> pd.DataFrame:
        """Read CSV safely, return empty DF if not exists"""
        file_path = self.files.get(file_type)
        if not file_path or not os.path.exists(file_path):
            return pd.DataFrame()
        try:
            return pd.read_csv(file_path)
        except Exception:
            return pd.DataFrame()

    def _save_csv(self, file_type: str, df: pd.DataFrame) -> bool:
        """Save DataFrame to CSV"""
        file_path = self.files.get(file_type)
        if not file_path:
            return False
        try:
            df.to_csv(file_path, index=False)
            return True
        except Exception:
            return False

    def get_all(self, file_type: str) -> List[Dict[str, Any]]:
        """Get all records for a category"""
        df = self._read_csv(file_type)
        if df.empty:
            return []
        
        # Replace NaN with None (null in JSON)
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient="records")

    def add_record(self, file_type: str, record: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new record"""
        df = self._read_csv(file_type)
        
        # Append new record
        new_row = pd.DataFrame([record])
        if df.empty:
            df = new_row
        else:
            df = pd.concat([df, new_row], ignore_index=True)
            
        if self._save_csv(file_type, df):
            return {"status": "success", "message": "Record added successfully"}
        else:
            raise Exception("Failed to save data")

    def delete_record(self, file_type: str, id_column: str, id_value: str) -> bool:
        """Delete a record by ID"""
        df = self._read_csv(file_type)
        if df.empty:
            return False
            
        # Ensure column exists
        if id_column not in df.columns:
            return False
            
        # Filter out the record (convert both to string for comparison safety)
        initial_len = len(df)
        df = df[df[id_column].astype(str) != str(id_value)]
        
        if len(df) == initial_len:
             return False # Nothing deleted
             
        return self._save_csv(file_type, df)

    def update_record(self, file_type: str, id_column: str, id_value: str, updates: Dict[str, Any]) -> bool:
        """Update a record by ID"""
        df = self._read_csv(file_type)
        if df.empty or id_column not in df.columns:
            return False
            
        mask = df[id_column].astype(str) == str(id_value)
        if not any(mask):
            return False
            
        for key, value in updates.items():
            if key in df.columns:
                df.loc[mask, key] = value
                
        return self._save_csv(file_type, df)

    def get_stats(self) -> Dict[str, Any]:
        """Get quick stats for dashboard"""
        stats = {}
        for key in self.files:
            df = self._read_csv(key)
            stats[key] = {
                "count": len(df),
                "columns": len(df.columns)
            }
        return stats

data_manager = DataManager()
