# App de Cadastro com Firebase e React Native

Este é um aplicativo mobile desenvolvido com **React Native** e **React Native Paper**, utilizando o **Firebase Authentication** e **Realtime Database** para que o usuário possa organizar seus documentos em um ambiente corporativo. O sistema permite criar contas com validação de senha, salvando dados no Auth e no banco de dados, além de possuir 3 cruds disponíveis de Empresas, Setores e Documentos.

## Tecnologias Utilizadas

- React Native com Expo
- Firebase Authentication
- Firebase Realtime Database
- React Native Paper
- TypeScript

## Funcionalidades

- Cadastro de novo usuário
- Validação de senha segura
- Armazenamento de dados no Realtime Database
- Atualização do `displayName` no Firebase Authentication
- Interface moderna e responsiva

## Demonstração

Veja o vídeo de demonstração abaixo:

[Video Demonstração](./src/assets/videos/Demonstracao.mp4)

## Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/BraceroInSabot/ArquiVia-Mobile.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto:
   ```bash
   npx expo start
   ```

> Certifique-se de ter configurado corretamente as credenciais do Firebase em `services/firebase.ts`.

## Estrutura do Projeto

- `Cadastro.tsx` - Tela principal de criação de conta.
- `services/firebase.ts` - Configuração do Firebase.
