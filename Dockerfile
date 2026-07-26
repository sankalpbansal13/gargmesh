# Garg Industrial Mesh — production image (Node 20 for better-sqlite3 prebuilds)
FROM node:20-bookworm-slim

WORKDIR /app

# Native build tools for better-sqlite3 (removed after npm ci to keep image lean)
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ curl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
  && apt-get update \
  && apt-get purge -y python3 make g++ \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*

COPY . .

RUN mkdir -p /app/data /app/public/uploads \
  && chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=3000

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/ > /dev/null || exit 1

CMD ["node", "src/server.js"]
