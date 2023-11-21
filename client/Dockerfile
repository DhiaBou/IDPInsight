FROM node:20-alpine
WORKDIR /app
COPY ./client/package.json ./client/package-lock.json /app/
RUN npm install
COPY ./client /app

# Expose port 3000 for the Node.js application
EXPOSE 3000

RUN npm run build
CMD ["npm", "start"]
