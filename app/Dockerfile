FROM node:current-alpine3.14 as dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:current-alpine3.14 as prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npx prisma generate
COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]

#WORKDIR /app
#ARG NODE_ENV=production
#COPY package*.json ./
#RUN npm install
#COPY ./ ./
#CMD ["npm", "run", "start"]