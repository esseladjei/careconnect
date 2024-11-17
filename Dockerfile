FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5000

RUN yarn run build

CMD ["yarn", "run","dev"]
