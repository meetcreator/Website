import json

from pathlib import Path

vercel_path = Path(__file__).parent / 'vercel.json'

with open(vercel_path, 'r') as f:
    data = json.load(f)

new_rewrites = []
for rw in data.get('rewrites', []):
    source = rw.get('source', '')
    dest = rw.get('destination', '')
    if source.startswith('/archshield/') and '.txt' in source:
        new_source = source.replace('/archshield/', '/', 1)
        # Check if this new_source already exists
        if not any(r.get('source') == new_source for r in data.get('rewrites', [])):
            new_rewrites.append({
                "source": new_source,
                "destination": dest
            })

if new_rewrites:
    data['rewrites'].extend(new_rewrites)
    with open(vercel_path, 'w') as f:
        json.dump(data, f, indent=4)
