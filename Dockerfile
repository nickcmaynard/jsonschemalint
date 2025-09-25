FROM docker.io/node:24@sha256:82a1d74c5988b72e839ac01c5bf0f7879a8ffd14ae40d7008016bca6ae12852b as builder

WORKDIR /opt/app-root/src/

COPY src/ src/
COPY public/ public/
COPY index.html .
COPY vite.config.js .
COPY package*.json .
COPY README.md .

# Use safe-chain wrapper for npm to mitigate supply chain attacks
RUN npm install -g @aikidosec/safe-chain \
    && rm -fr .cache .npm

# From now on we use aikido-npm directly instead of npm as the wrapper scripts don't work in this Dockerfile environment
# install run deps & dev deps
RUN aikido-npm ci \
    && rm -fr .cache .npm

RUN aikido-npm run build

# Actual production image
# Use a minimal image for production
# Specific SHA256 so dependabot can update it
# See https://github.com/lucacome/docker-image-update-checker/issues/71
FROM docker.io/nginxinc/nginx-unprivileged:latest@sha256:b58f87ce18de66dbc5bd2b557e20d509e445c12be59c0444d5c6acf5bcacc0f2 as production

# Copy the built files from the builder stage to the nginx html directory
COPY --from=builder /opt/app-root/src/dist/ /usr/share/nginx/html/

# Updated nginx configuration
COPY container-src/nginx-templates/default.conf.template /etc/nginx/templates/default.conf.template

# Ensure NGINX uses resolvers set in /etc/resolv.conf
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

EXPOSE 8080

USER 33:33