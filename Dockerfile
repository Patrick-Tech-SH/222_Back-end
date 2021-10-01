FROM node:16.6.0

WORKDIR /usr/src/app

COPY package*.json ./

COPY .env /usr/src/app/

RUN npm install

COPY . .

EXPOSE 3000

RUN npx prisma generate

CMD ["npm","run","dev"]