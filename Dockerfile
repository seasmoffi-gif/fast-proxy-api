# Temel image olarak Node 20 kullanıyoruz
FROM node:20-alpine

# Çalışma dizini
WORKDIR /app

# package.json ve package-lock.json kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install --production

# Uygulama dosyalarını kopyala
COPY . .

# Uygulamayı expose et
EXPOSE 3000

# Başlatma komutu
CMD ["node", "index.js"]
