FROM node:20 as base

FROM base as test
WORKDIR /app
COPY . .
ENV MONGOMS_DOWNLOAD_URL=https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian12-7.0.7.tgz
ENV MONGOMS_VERSION=7.0.7
RUN npm install && npm run test

FROM node:20-alpine as build
WORKDIR /app
COPY --from=test /app/package.json ./package.json
COPY --from=test /app/src ./src
RUN npm install && npm run build && npm prune --production

FROM node:20-alpine as production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./
COPY --from=build /app/package.json ./
ENV NODE_ENV=production
EXPOSE 80
CMD ["npm", "run", "start"]
