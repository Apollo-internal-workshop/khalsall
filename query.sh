#!/bin/bash
# Sends a query file to the demo router and prints the JSON response.
#
# Usage: ./query.sh queries/quakes-and-whats-around.graphql [url]
# The url defaults to http://127.0.0.1:4300/, where either launcher serves.
set -euo pipefail

FILE=${1:?usage: ./query.sh <query file> [url]}
URL=${2:-http://127.0.0.1:4300/}

python3 -I - "$FILE" "$URL" <<'EOF'
import json, sys, urllib.request
query = open(sys.argv[1]).read()
req = urllib.request.Request(
    sys.argv[2],
    data=json.dumps({"query": query}).encode(),
    headers={"Content-Type": "application/json"},
)
with urllib.request.urlopen(req, timeout=120) as resp:
    body = json.load(resp)
json.dump(body, sys.stdout, indent=2)
print()
sys.exit(1 if body.get("errors") else 0)
EOF
