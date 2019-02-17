FROM node:10.15.1-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:10.15.1-alpine as production-stage
COPY --from=build-stage /app /
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]