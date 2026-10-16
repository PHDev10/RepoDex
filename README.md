# 📱 RepoDex

O **RepoDex** é um aplicativo mobile desenvolvido em React Native e Expo que funciona como um buscador e catálogo pessoal de repositórios do GitHub. Com ele, você pode buscar projetos diretamente da API do GitHub informando o Dono (Owner) e o Nome do Repositório (Repo ID), e salvá-los localmente no seu dispositivo.

Este projeto foi desenvolvido como prática acadêmica da disciplina de Programação para Dispositivos Móveis.

---

## 🚀 Funcionalidades

- **Busca via API:** Integração direta com a [API pública do GitHub](https://docs.github.com/pt/rest) para buscar dados atualizados dos repositórios.
- **Catálogo Offline:** Salvamento e persistência dos repositórios pesquisados na memória do celular utilizando `AsyncStorage`. Os dados permanecem mesmo após fechar o app.
- **Listagem Detalhada:** Exibição do nome do projeto, linguagem principal, quantidade de estrelas (_stars_), nome do dono e link do perfil.
- **Limpeza de Dados:** Opção rápida no cabeçalho (Header) para limpar todo o catálogo salvo.

---

## 🛠️ Tecnologias Utilizadas

- **[React Native](https://reactnative.dev/):** Framework principal para desenvolvimento mobile multiplataforma.
- **[Expo](https://expo.dev/):** Plataforma e framework que facilita o desenvolvimento e testes no React Native.
- **[Expo Router](https://docs.expo.dev/router/introduction/):** Roteamento moderno baseado em arquivos (File-based routing).
- **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para maior segurança e qualidade do código.
- **[Axios](https://axios-http.com/):** Cliente HTTP para realizar as requisições à API do GitHub.
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/):** Sistema de armazenamento assíncrono e persistente de dados locais.

---

## ⚙️ Como executar o projeto

Certifique-se de ter o **Node.js** instalado na sua máquina e o aplicativo **Expo Go** no seu celular (ou um emulador Android/iOS configurado).

### 1. Clone o repositório

\`\`\`bash
git clone https://github.com/SEU_USUARIO/repodex.git
cd repodex
\`\`\`

### 2. Instale as dependências padrão

\`\`\`bash
npm install
\`\`\`

### 3. Instale as bibliotecas específicas do projeto

\`\`\`bash
npx expo install axios @react-native-async-storage/async-storage
\`\`\`

### 4. Inicie o servidor de desenvolvimento

\`\`\`bash
npx expo start
\`\`\`

Após iniciar, escaneie o **QR Code** exibido no terminal utilizando o aplicativo Expo Go no seu celular, ou pressione `a` no terminal para rodar diretamente via cabo USB/Emulador Android.

---

## 👥 Desenvolvedores

Projeto desenvolvido em dupla para a disciplina de Programação para Dispositivos Móveis:

- **Pedro Henrique Santos de Pontes**
- **Mateus Roseno**
