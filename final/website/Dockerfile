# ==== CONFIGURE =====
# Use a Node 18 base image
FROM node:18-alpine 
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .

# Download build dependency
RUN npm install react-scripts

# Set the env to "production"
ENV NODE_ENV=production

# Build the app (no need for build-time router URL anymore)
RUN npm run build --verbose

# Copy the startup script and make it executable
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# ==== RUN =======
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000

# Start the app using our startup script
CMD ["/app/start.sh"]
