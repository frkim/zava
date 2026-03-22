# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '$API_BASE_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
