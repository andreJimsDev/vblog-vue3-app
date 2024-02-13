FROM node:16 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-slim

WORKDIR /app

COPY --from=build /app/dist ./dist

EXPOSE 8080

# Command to run the Vue application
CMD ["npx", "http-server", "./dist"]