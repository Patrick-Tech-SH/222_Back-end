FROM node:16.6.0-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npx prisma db push

RUN npx prisma generate

CMD ["npm","run","dev"]