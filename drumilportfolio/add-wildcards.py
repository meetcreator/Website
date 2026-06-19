import json

from pathlib import Path

vercel_path = Path(__file__).parent / 'vercel.json'

with open(vercel_path, 'r') as f:
    data = json.load(f)

new_rewrites = [
    {
        "source": "/dashboard/:path*",
        "destination": "/archshield-app/frontend/out/dashboard/:path*"
    },
    {
        "source": "/login/:path*",
        "destination": "/archshield-app/frontend/out/login/:path*"
    },
    {
        "source": "/signup/:path*",
        "destination": "/archshield-app/frontend/out/signup/:path*"
    },
    {
        "source": "/__next:path*",
        "destination": "/archshield-app/frontend/out/__next:path*"
    }
]

# Append only if they don't exist
existing_sources = [rw.get('source') for rw in data.get('rewrites', [])]
for rw in new_rewrites:
    if rw['source'] not in existing_sources:
        data['rewrites'].append(rw)

with open(vercel_path, 'w') as f:
    json.dump(data, f, indent=4)
