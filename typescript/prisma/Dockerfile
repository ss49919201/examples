FROM node:20-alpin9
COPY . .

RUN npm ci

ENV DEBUG="*"

CMD ["npx", "prisma", "migrate", "deploy"]
