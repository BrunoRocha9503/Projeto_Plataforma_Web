FROM node:18 
WORKDIR /
COPY . .
RUN npm cache clean --force
RUN rm -rf node_modules
RUN npm install
CMD ["npm", "start"]
EXPOSE 3000
