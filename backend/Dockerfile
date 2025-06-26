# Use official Node.js 22 image
FROM node:22.12.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prisma setup
RUN npx prisma generate

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "app.js"]
