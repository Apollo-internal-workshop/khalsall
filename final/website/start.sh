#!/bin/sh

# Replace the placeholder in config.js with the actual router URL
# Use the ROUTER_URL environment variable, or fall back to a default
ROUTER_URL=${ROUTER_URL:-"router-j3nprurqka-ue.a.run.app"}

echo "Configuring app with ROUTER_URL: $ROUTER_URL"

# Replace the placeholder in the config file
sed -i "s|__ROUTER_URL__|$ROUTER_URL|g" /app/build/config.js

# Start the server
exec npx serve build 