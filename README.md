Nome do Projeto: Plataforma web com integração a redes sociais.
O objetivo do nosso projeto, consiste em criar uma plataforma web integrada com outras mídias sociais, facilitando o compartilhamento de suas publicações aumentando o engajamento de seu negócio.

Pré-requisitos:
- Possuir contas em mídias sociais que serão utilizadas nesta plataforma.
- Acesso à Web via Desktop.

Funcionalidades: 
-	Integração com outras plataformas
-	Publicações de imagens e textos.
-	Segurança dos dados.
-	Interface amigável e intuitiva.

Stakeholders:
-	Bruno Rocha
-   Edison Tezolin
-	Eduardo Veiga
-	Kelvin Willian
-	Willian Tezolin


#Docker

- Segue abaixo o passo a passo para inicializar o projeto utilizando o Docker:

- Passo 01: script para criação do arquivo Dockerfile

    FROM node:18
    WORKDIR /
    COPY . .
    RUN npm cache clean --force
    RUN rm -rf node_modules
    RUN npm install
    CMD ["npm", "start"]
    EXPOSE 3000

- Passo 02: comando para criação da imagem docker

    docker build -t app .

- Passo 03: comando para inicializar o container docker

    docker run -p 3000:3000 app