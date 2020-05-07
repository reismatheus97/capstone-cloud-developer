FROM node:10 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 8080

EXPOSE 8080

CMD ["npm", "run", "serve"]
