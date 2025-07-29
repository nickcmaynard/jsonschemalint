FROM docker.io/node:24 as builder

WORKDIR /opt/app-root/src/

COPY src/ src/
COPY public/ public/
COPY index.html .
COPY vite.config.js .
COPY package*.json .
COPY README.md .


# install run deps & dev deps
RUN npm ci \
    && rm -fr .cache .npm

RUN npm run build

# Actual production image
# Use a minimal image for production
FROM docker.io/nginx:latest as production

# Copy the built files from the builder stage to the nginx html directory
COPY --from=builder /opt/app-root/src/dist/ /usr/share/nginx/html/

EXPOSE 8080