FROM node:20-alpine
COPY . .

RUN npm ci

ENV DEBUG="*"

CMD ["npx", "prisma", "migrate", "dev"]
