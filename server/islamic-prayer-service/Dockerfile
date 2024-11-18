FROM node:lts-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 50061