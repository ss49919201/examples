FROM node:20-alpin
COPY . .

RUN npm ci

ENV DEBUG="*"

CMD ["npx", "prisma", "migrate", "deploy"]
