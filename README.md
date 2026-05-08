# 🏢 Gestora Front

Frontend do sistema **Gestora** — plataforma de gestão de insumos, fornecedores, filiais, pedidos e solicitações. Construído com **Next.js 16**, **React 19**, **TypeScript** e **Tailwind CSS 4**.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:

- **Node.js** — versão 18 ou superior  
  👉 [https://nodejs.org](https://nodejs.org)
- **npm** — vem incluído com o Node.js (ou use `yarn` / `pnpm` se preferir)
- **Git** — para clonar o repositório  
  👉 [https://git-scm.com](https://git-scm.com)

> ⚠️ **Importante:** Este frontend depende de uma API backend rodando em `http://localhost:4000/api`. Certifique-se de que o backend esteja em execução antes de usar o sistema.

---

## 🚀 Como baixar e rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/gestora-front.git
```

### 2. Acesse a pasta do projeto

```bash
cd gestora-front
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 5. Acesse no navegador

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📦 Scripts disponíveis

| Comando         | Descrição                                      |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento           |
| `npm run build` | Gera a build de produção                       |
| `npm start`     | Inicia o servidor com a build de produção      |

---

## 🗂️ Estrutura do projeto

```
gestora-front/
├── public/              # Arquivos estáticos (ícones, imagens)
├── src/
│   ├── app/
│   │   ├── components/  # Componentes compartilhados (Sidebar, Layout, etc.)
│   │   ├── login/       # Página de login
│   │   ├── filiais/     # Página de filiais
│   │   ├── fornecedores/# Página de fornecedores
│   │   ├── insumos/     # Página de insumos
│   │   ├── solicitacoes/# Página de solicitações
│   │   ├── aprovacoes/  # Página de aprovações
│   │   ├── pedidos/     # Página de pedidos
│   │   ├── consumo/     # Página de consumo
│   │   ├── alertas/     # Página de alertas
│   │   ├── relatorios/  # Página de relatórios
│   │   ├── layout.tsx   # Layout raiz da aplicação
│   │   ├── page.tsx     # Dashboard principal
│   │   └── globals.css  # Estilos globais
│   ├── components/      # Componentes de proteção de rotas
│   └── lib/
│       └── api.ts       # Configuração e funções da API
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## 🛠️ Tecnologias utilizadas

- [Next.js 16](https://nextjs.org/) — Framework React com App Router
- [React 19](https://react.dev/) — Biblioteca de interface
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática
- [Tailwind CSS 4](https://tailwindcss.com/) — Framework de estilos utilitários
- [Recharts](https://recharts.org/) — Gráficos e visualizações
- [Lucide React](https://lucide.dev/) — Ícones

---

## 🔗 API Backend

O frontend se comunica com a API backend na URL:

```
http://localhost:4000/api
```

Certifique-se de que o backend esteja rodando antes de iniciar o frontend. Caso a URL da API seja diferente, atualize o arquivo `src/lib/api.ts`.

---

## 📄 Licença

Este projeto é privado e de uso interno.
