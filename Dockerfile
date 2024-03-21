# Usa un'immagine di base di Node.js
FROM node:latest

# Imposta la directory di lavoro nell'immagine
WORKDIR /app

# Copia il codice della frontend nella directory /app/frontend
COPY SocialNetworkFE /app/frontend

# Copia il codice della backend nella directory /app/backend
COPY SocialNetworkBE /app/backend

# Installa le dipendenze per la frontend
WORKDIR /app/frontend
RUN npm install

# Installa le dipendenze per la backend
WORKDIR /app/backend
RUN npm install

# Builda la frontend
WORKDIR /app/frontend
RUN npm run build

# Esponi la porta sulla quale il server sarà in ascolto (sostituisci con la porta corretta)
EXPOSE ${ENV_PORT}

WORKDIR /app/backend

# Comando per avviare il server che gestisce sia la frontend che la backend
CMD ["npm","start"]

