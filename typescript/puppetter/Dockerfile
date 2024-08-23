# Node.js 20 Alpine
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy files
COPY . .

# Install npm packages
RUN npm ci

# Add user so we don't need --no-sandbox.
RUN addgroup -S appuser && adduser -S -G appuser appuser \
    && mkdir -p /home/appuser/Downloads /app \
    && chown -R appuser:appuser /home/appuser \
    && chown -R appuser:appuser /app

# Run everything after as non-privileged user.
USER appuser

# Run the app
CMD ["npx", "tsx", "index.ts"]
