import json
import os
from pathlib import Path

vercel_path = Path(__file__).parent / "vercel.json"
base_dir = Path(__file__).parent / "olympiad/out"

with open(vercel_path, "r", encoding="utf-8") as f:
    data = json.load(f)

rewrites = data.get("rewrites", [])
existing_sources = {r["source"] for r in rewrites}

new_rewrites = []

# HTML routes
html_files = list(base_dir.rglob("*.html"))
for f in html_files:
    rel = f.relative_to(base_dir).as_posix()
    if rel in ["404.html", "_not-found.html"]:
        continue
        
    route = rel.replace(".html", "")
    if route == "index":
        source = "/olympiad"
        dest = "/olympiad/out"
    else:
        source = f"/olympiad/{route}"
        dest = f"/olympiad/out/{route}"
        
    if source not in existing_sources:
        new_rewrites.append({"source": source, "destination": dest})

# txt routes
txt_files = list(base_dir.rglob("*.txt"))
for f in txt_files:
    rel = f.relative_to(base_dir).as_posix()
    if "__next" in rel and len(rel.split("__next")) > 1 and "/" in rel.split("__next")[1]:
        parts = rel.split("__next")
        prefix = parts[0]
        suffix = parts[1]
        
        encoded_suffix = suffix.replace("/", ".")
        source = f"/olympiad/{prefix}__next{encoded_suffix}"
        dest = f"/olympiad/out/{rel}"
        
        if source not in existing_sources:
            new_rewrites.append({"source": source, "destination": dest})

if new_rewrites:
    data["rewrites"] = new_rewrites + rewrites
    with open(vercel_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
    print(f"Added {len(new_rewrites)} rewrites.")
else:
    print("No new rewrites needed.")
