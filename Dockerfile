# Node 20 Alpine kullanıyoruz
FROM node:20-alpine

WORKDIR /app

# package.json ve package-lock.json kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install --production

# Uygulama dosyalarını kopyala
COPY . .

EXPOSE 3009

CMD ["node", "index.js"]
