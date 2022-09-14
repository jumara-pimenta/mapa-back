FROM node:lts-alpine as production

ARG NODE_ENV
ARG PORT

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

ENV TZ=America/Manaus
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY package*.json ./

COPY ./prisma prisma

RUN npm install --only=production --silent
RUN npx prisma generate
COPY . .

EXPOSE ${PORT}

CMD ["node", "dist/main"]
