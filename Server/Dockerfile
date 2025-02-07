FROM node:18

WORKDIR /Users/stv/Documents/Github/care-compass/Server

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3001

CMD [ "node", "dist/main.js" ]