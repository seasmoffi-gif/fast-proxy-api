# Node 18 Alpine kullanıyoruz
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3009

CMD ["node", "index.js"]