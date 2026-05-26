import json

with open('vercel.json', 'r') as f:
    data = json.load(f)

for rw in data.get('rewrites', []):
    dest = rw.get('destination', '')
    if dest.endswith('/index.html'):
        rw['destination'] = dest[:-11]
    elif dest.endswith('.html'):
        rw['destination'] = dest[:-5]

with open('vercel.json', 'w') as f:
    json.dump(data, f, indent=4)
