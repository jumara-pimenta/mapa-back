FROM node:lts-alpine as production

ARG NODE_ENV
ARG PORT

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

ENV TZ=America/Manaus
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY package*.json ./

RUN npm install --only=production --silent

COPY . .
COPY ./prisma prisma

RUN npx prisma migrate dev

EXPOSE ${PORT}
CMD ["node", "dist/main"]
