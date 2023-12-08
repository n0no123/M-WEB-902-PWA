FROM node:18.3.0-alpine3.14 AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:18.3.0-alpine3.14

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=build /app/dist ./dist
RUN mkdir dist/images
ENV NODE_ENV=production

CMD ["yarn", "start"]
