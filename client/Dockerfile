# Usa un'immagine di Node.js
FROM node:20.12.2

# Imposta la directory di lavoro
WORKDIR /app

# Copia il package.json e il package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice dell'applicazione
COPY . .

# Esponi la porta 4200
EXPOSE 4200

# Comando per avviare l'app Angular in modalità serve con il proxy
CMD ["npm", "run", "start"]
