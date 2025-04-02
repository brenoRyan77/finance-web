# Etapa 1: Criar uma imagem baseada no Node.js
FROM node:16 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json para o diretório de trabalho
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar o restante dos arquivos do projeto
COPY . .

# Construir o projeto React
RUN npm run build

# Etapa 2: Servir os arquivos estáticos gerados pelo build
FROM nginx:alpine

# Copiar os arquivos do build para o diretório padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expor a porta 80 para acesso ao servidor
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
