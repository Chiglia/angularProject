FROM node:latest

WORKDIR /app

COPY SocialNetworkBE/package.json ./
COPY SocialNetworkBE/package-lock.json* ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE ${ENV_PORT}

CMD ["nodemon", "index.js"]
