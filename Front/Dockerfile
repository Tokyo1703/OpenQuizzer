FROM node:22.14.0

WORKDIR /Front

RUN npm install -g @angular/cli@19.2.7

COPY package*.json ./

RUN npm install

EXPOSE 4200


COPY . .

CMD ["ng", "serve", "--host", "0.0.0.0"]