FROM node:18.3.0-alpine3.14 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG react_app_api_url=https://unpeumoinsdunkilo.prophecy-eip.com/api
ENV REACT_APP_API_URL=$react_app_api_url
ENV NODE_ENV production

RUN npm run build

FROM node:18.3.0-alpine3.14

WORKDIR /app

COPY --from=build /app/build ./build

RUN npm install -g serve

ENV REACT_APP_API_URL=$react_app_api_url

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
