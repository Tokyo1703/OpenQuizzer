# Imagen de node.js para el backend
FROM node:22.14.0

# Creamos el directorio de trabajo dentro del contenedor
WORKDIR /Back

# Copiamos package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalamos las dependencias 
RUN npm install

# Copiamos el resto de los archivos al directorio de trabajo
COPY . .

# Expose the port the backend will run on
EXPOSE 3000

RUN apt-get update && apt-get install -y wget && \
    wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz && \
    tar -xvf dockerize-linux-amd64-v0.6.1.tar.gz && \
    mv dockerize /usr/local/bin/

# Start the backend server

CMD ["dockerize", "-wait", "tcp://database:3306", "-timeout", "30s", "npm", "run", "dev"]