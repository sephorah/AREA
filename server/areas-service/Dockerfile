FROM node:lts-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 50051