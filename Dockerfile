# Etapa 1: Criar a imagem baseada no Node.js 22
FROM node:22 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json (ou yarn.lock, se usar Yarn)
COPY package.json package-lock.json ./

# Limpar o cache do npm
RUN npm cache clean --force

# Instalar dependências com --legacy-peer-deps para resolver conflitos de versão
RUN npm install --legacy-peer-deps

# Copiar o restante dos arquivos do projeto
COPY . .

# Construir o projeto usando Vite
RUN npm run build

# Etapa 2: Servir os arquivos estáticos com um servidor Nginx
FROM nginx:alpine

# Copiar os arquivos do build gerado pelo Vite para o diretório de arquivos estáticos do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta 80 para acesso ao servidor
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
