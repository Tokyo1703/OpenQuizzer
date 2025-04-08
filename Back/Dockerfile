# Imagen de node.js para el backend
FROM node:22

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

# Start the backend server
CMD ["npm", "run", "dev"]