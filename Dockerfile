# Base Stage

FROM node:20 as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

# Development Stage
FROM base As Development
RUN npm run build
CMD ["npm", "run","dev"]

# Production Stage
FROM base As Production
RUN npm run build
CMD ["npm", "run","start"]
