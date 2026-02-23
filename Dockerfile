FROM docker.io/node:25@sha256:39f92e620aa34854b8877b43bdffd411a301a50eefb38400785a01991f25a2f6 as builder

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
FROM docker.io/nginxinc/nginx-unprivileged:latest@sha256:0ac6770a4747ee05799deba85731496e001bbfdcd204a27f364090fa9ad77157 as production

# Copy the built files from the builder stage to the nginx html directory
COPY --from=builder /opt/app-root/src/dist/ /usr/share/nginx/html/

# Updated nginx configuration
COPY container-src/nginx-templates/default.conf.template /etc/nginx/templates/default.conf.template

# Adjust permissions on the conf.d directory so our template can be used
# Switch to root to change permissions
USER 0
RUN chgrp -R 101 /etc/nginx/conf.d
# Switch back to www-data
USER 101:101

# Ensure NGINX uses resolvers set in /etc/resolv.conf
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

EXPOSE 8080

LABEL org.opencontainers.image.title="jsonschemalint"
LABEL org.opencontainers.image.description="Web interface for jsonschemalint.com - a JSON Schema linter"
LABEL org.opencontainers.image.authors="Nick Maynard"
LABEL org.opencontainers.image.url="https://jsonschemalint.com"
LABEL org.opencontainers.image.source="https://github.com/nickmaynard/jsonschemalint"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.base.name="docker.io/nginxinc/nginx-unprivileged:latest"
LABEL org.opencontainers.image.revision=""
LABEL org.opencontainers.image.version=""
LABEL org.opencontainers.image.created=""
LABEL maintainer="Nick Maynard"
