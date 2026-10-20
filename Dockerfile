FROM node:22-alpine AS build
WORKDIR /app

# Copy only dependency manifests before source to preserve the npm cache layer.
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

COPY index.html ./
COPY src ./src
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
