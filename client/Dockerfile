FROM node:16-alpine as build

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install --legacy-peer-deps

COPY --chown=node:node . .

EXPOSE 3000

ENV CI=true

CMD ["npm", "start"]