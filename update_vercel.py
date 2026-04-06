import os
import json
from pathlib import Path

def update_vercel():
    v = Path(r"c:\Users\Drumil\Documents\GitHub\Website\vercel.json")
    with open(v, 'r', encoding='utf-8') as f:
        data = json.load(f)

    rewrites = []
    
    # Archshield
    a_out = Path(r"c:\Users\Drumil\Documents\GitHub\Website\archshield-app\frontend\out")
    if a_out.exists():
        for f in a_out.rglob("*.txt"):
            rel = f.relative_to(a_out).as_posix()
            if "__next" in rel and "/" in rel:
                pass # keep simple, not strictly needed if we map paths directly
        
        for f in a_out.rglob("index.html"):
            rel = f.relative_to(a_out).as_posix()
            route = rel.replace("/index.html", "").replace("index.html", "")
            
            # Map with /archshield prefix
            if route == "":
                rewrites.append({"source": f"/archshield", "destination": f"/archshield-app/frontend/out/{rel}"})
            else:
                rewrites.append({"source": f"/archshield/{route}", "destination": f"/archshield-app/frontend/out/{rel}"})
                # Map without prefix because Next.js has href="/dashboard"
                rewrites.append({"source": f"/{route}", "destination": f"/archshield-app/frontend/out/{rel}"})

    added = {r["source"] for r in data.get("rewrites", [])}
    new_r = [r for r in rewrites if r["source"] not in added]

    if new_r:
        data.setdefault("rewrites", [])
        data["rewrites"] = new_r + data["rewrites"]
        with open(v, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        print("Done")

if __name__ == "__main__":
    update_vercel()
