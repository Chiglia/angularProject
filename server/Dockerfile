# Usa un'immagine Node.js specifica
FROM node:20.12.2

# Imposta la directory di lavoro
WORKDIR /app

# Copia il package.json e il package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice dell'applicazione
COPY . .

# Esponi la porta dell'app
EXPOSE 3000

# Comando per avviare l'app
CMD ["npm", "run", "dev"]
