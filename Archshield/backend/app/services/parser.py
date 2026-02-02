import re
from typing import Dict, List, Any

class ArchitectureParser:
    @staticmethod
    def parse_terraform(content: str) -> Dict[str, Any]:
        """
        A basic regex-based parser for Terraform files to extract resources.
        In a production app, we would use a more robust HCL parser.
        """
        resources = []
        # Match pattern: resource "provider_type" "name" {
        resource_pattern = r'resource\s+"([^"]+)"\s+"([^"]+)"\s+{'
        matches = re.finditer(resource_pattern, content)
        
        for match in matches:
            res_type = match.group(1)
            res_name = match.group(2)
            
            # Simple categorization based on AWS types
            category = "Unknown"
            if "instance" in res_type or "lambda" in res_type:
                category = "Compute"
            elif "s3" in res_type or "db" in res_type or "rds" in res_type:
                category = "Storage/Database"
            elif "vpc" in res_type or "subnet" in res_type or "security_group" in res_type:
                category = "Networking"
            elif "iam" in res_type:
                category = "IAM"
                
            resources.append({
                "type": res_type,
                "name": res_name,
                "category": category
            })
            
        return {
            "resource_count": len(resources),
            "resources": resources,
            "provider": "aws" if "aws_" in content else "unknown"
        }

    @staticmethod
    def generate_recommendations(parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate mock recommendations based on parsed resources.
        """
        recommendations = []
        resources = parsed_data.get("resources", [])
        
        # Example rule: S3 bucket security
        s3_buckets = [r for r in resources if "s3_bucket" in r["type"]]
        if s3_buckets:
            recommendations.append({
                "id": "REC-001",
                "title": "Enable S3 Public Access Block",
                "severity": "Critical",
                "description": f"Detected {len(s3_buckets)} S3 bucket(s). Ensure public access is explicitly blocked to prevent data leaks.",
                "category": "Security"
            })
            
        # Example rule: RDS backup
        if any("db_instance" in r["type"] for r in resources):
            recommendations.append({
                "id": "REC-002",
                "title": "Configure Multi-AZ for RDS",
                "severity": "High",
                "description": "Critical for high availability. Single-AZ deployments are at risk during infrastructure failures.",
                "category": "Reliability"
            })
            
        # Example rule: Cost
        if any("instance" in r["type"] for r in resources):
            recommendations.append({
                "id": "REC-003",
                "title": "Use Graviton-based Instances",
                "severity": "Low",
                "description": "Switching to t4g or m6g instances can save up to 40% on compute costs for applicable workloads.",
                "category": "Cost"
            })
            
        # Example rule: IAM least privilege
        if any("iam" in r["type"] for r in resources):
            recommendations.append({
                "id": "REC-004",
                "title": "Enforce IAM Least Privilege",
                "severity": "Medium",
                "description": "IAM policies should follow the principle of least privilege. Avoid using wildcards (*) in resource actions.",
                "category": "Security"
            })

        # Example rule: Multi-cloud check
        if parsed_data.get("provider") == "unknown":
            recommendations.append({
                "id": "REC-005",
                "title": "Specify Cloud Provider",
                "severity": "Low",
                "description": "Provider not detected. Explicitly defining your cloud provider helps us apply region-specific best practices.",
                "category": "General"
            })
            
        return recommendations
