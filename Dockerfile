# Usa una imagen base ligera de Node.js
FROM node:21-alpine

# Establece el directorio de trabajo en la aplicación
WORKDIR /usr/src/app

# Copia solo los archivos necesarios para instalar las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install --omit=dev



# Copia el código fuente de la aplicación
COPY . .

# Expón el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Define el comando para ejecutar la aplicación
CMD [ "npm", "start" ]
