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
# Specific SHA256 so dependabot can update it
# See https://github.com/lucacome/docker-image-update-checker/issues/71
FROM docker.io/nginx:latest@sha256:63a806f8f9c6bf69a17a28aaad48d8c6b38b9007a78db520d11d122126f8a0fb as production

# Copy the built files from the builder stage to the nginx html directory
COPY --from=builder /opt/app-root/src/dist/ /usr/share/nginx/html/

EXPOSE 8080
