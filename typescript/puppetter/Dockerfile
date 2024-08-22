# Node.js 20 Alpine
FROM node:20-alpine

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
# RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
#     && mkdir -p /home/pptruser/Downloads /app \
#     && chown -R pptruser:pptruser /home/pptruser \
#     && chown -R pptruser:pptruser /app
# Run everything after as non-privileged user.
# USER pptruser

# Run the app
CMD ["npx", "tsx", "index.ts"]
