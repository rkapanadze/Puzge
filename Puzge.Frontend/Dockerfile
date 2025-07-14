# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./
RUN npm ci

# Copy source code (excluding node_modules)
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built app from the browser subdirectory (Angular 17+ structure)
COPY --from=build /app/dist/Puzge.Frontend/browser/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]