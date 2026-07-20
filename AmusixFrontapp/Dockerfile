FROM node:24-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd AS build
WORKDIR /app

ARG APP_BASE_URL

# Copy everything
COPY . ./


# Install dependencies
RUN npm ci

# Download JSON file editer CLI
RUN apk add jq

# Set configuration
RUN jq --arg apiUrl "$APP_BASE_URL/api" '.apiUrl = $apiUrl' src/environments/environment.production.json > temp-config
RUN mv temp-config src/environments/environment.production.json

# Build app
RUN npm run build -- --base-href "$APP_BASE_URL/"

FROM nginx:alpine@sha256:54f2a904c251d5a34adf545a72d32515a15e08418dae0266e23be2e18c66fefa
WORKDIR /app

# Copy Nginx conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy application build to Nginx folder
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Launch Nginx
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
