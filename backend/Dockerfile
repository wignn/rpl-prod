FROM node:22-slim

RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --production

COPY init.sh ./init.sh

RUN chmod +x ./init.sh

EXPOSE 4000

CMD ["sh", "-c", "npm run start:prod & ./init.sh"]
