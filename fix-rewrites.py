import os
import json
from pathlib import Path

base_dir = Path(r"c:\Users\Drumil\Documents\GitHub\Website\archshield-app\frontend\out")
vercel_json_path = Path(r"c:\Users\Drumil\Documents\GitHub\Website\vercel.json")

with open(vercel_json_path, 'r', encoding='utf-8') as f:
    vercel = json.load(f)

new_rewrites = []

for f in txt_files:
    rel = f.relative_to(base_dir).as_posix()
    if "__next" in rel and len(rel.split("__next")) > 1 and "/" in rel.split("__next")[1]:
        parts = rel.split("__next")
        prefix = parts[0]
        suffix = parts[1]
        
        encoded_suffix = suffix.replace("/", ".")
        
        source = f"/archshield/{prefix}__next{encoded_suffix}"
        destination = f"/archshield-app/frontend/out/{rel}"
        
        new_rewrites.append({
            "source": source,
            "destination": destination
        })

existing_sources = {r["source"] for r in vercel.get("rewrites", [])}
to_add = [r for r in new_rewrites if r["source"] not in existing_sources]

if to_add:
    vercel.setdefault("rewrites", [])
    vercel["rewrites"] = to_add + vercel["rewrites"]
    
    with open(vercel_json_path, 'w', encoding='utf-8') as f:
        json.dump(vercel, f, indent=4)
        
    print(f"Added {len(to_add)} rewrites.")
else:
    print("No new rewrites needed.")
