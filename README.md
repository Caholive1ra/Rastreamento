<div align="center">

# ⏱️ Retainer Dashboard

**Plataforma fullstack de rastreamento de horas para contratos de retainer freelance.**

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Stack Tecnológica](#-stack-tecnológica)
- [Pré-requisitos](#-pré-requisitos)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [API Reference](#-api-reference)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Deploy em Produção](#-deploy-em-produção)
- [Segurança](#-segurança)

---

## 🚀 Sobre o Projeto

O **Retainer Dashboard** é uma aplicação web fullstack desenvolvida para facilitar o controle de horas trabalhadas em contratos de retainer (pacote de horas mensal). Ele oferece uma interface limpa e intuitiva onde o **administrador** pode iniciar/parar sessões de trabalho e o **cliente** pode acompanhar em tempo real o progresso das horas contratadas.

> **Caso de uso:** Um freelancer contrata 60 horas mensais com um cliente. Com essa ferramenta, ambos têm visibilidade completa sobre o consumo do pacote — sem planilhas, sem WhatsApp, sem achismo.

---

## ✨ Funcionalidades

### 👤 Painel do Administrador
- ▶️ **Iniciar** uma nova sessão de trabalho com descrição da tarefa
- ⏹️ **Parar** o timer com um clique
- 📋 Visualizar o **histórico completo** de todas as sessões
- 📊 Acompanhar o **total de horas trabalhadas** vs horas contratadas

### 👁️ Painel do Cliente
- 📡 Visualização em **tempo real** do timer ativo (com polling automático)
- 📈 Barra de progresso das **horas consumidas** do pacote
- 📜 Histórico de sessões com **duração formatada**
- 📊 Estatísticas consolidadas do contrato

### 🔐 Autenticação & Controle de Acesso
- Sistema de **login** com usuário e senha
- Dois perfis: `ADMIN` (controle total) e `CLIENT` (somente leitura)
- **Basic Auth** com tokens armazenados localmente
- Redirecionamento automático baseado no perfil do usuário

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                     │
│                                                              │
│   ┌──────────────┐    ┌───────────────┐    ┌─────────────┐  │
│   │  Login Page  │    │ Admin Dashboard│    │Client Dashboard│ │
│   └──────┬───────┘    └───────┬───────┘    └──────┬──────┘  │
│          └────────────────────┴──────────────────┘          │
│                               │ React + TypeScript           │
│                               │ Vite + TailwindCSS           │
│                               │ Axios (HTTP Client)          │
└───────────────────────────────┼─────────────────────────────┘
                                │ HTTPS / Basic Auth
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                      │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐   │
│   │              Spring Security (Basic Auth)             │   │
│   └──────────────────────┬───────────────────────────────┘   │
│                          │                                    │
│   ┌──────────┐    ┌──────┴───────┐    ┌──────────────────┐   │
│   │AuthCtrl  │    │TrackerCtrl   │    │   Spring Data JPA │   │
│   └──────────┘    └──────┬───────┘    └────────┬─────────┘   │
│                          │                     │              │
│                    ┌─────┴─────┐               │              │
│                    │TrackerSvc │               │              │
│                    └─────┬─────┘               │              │
│                          └──────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    BANCO DE DADOS                             │
│                                                              │
│              PostgreSQL (Prod) / H2 (Dev local)              │
│                                                              │
│    Tabela: work_sessions                                     │
│    ┌────┬─────────────┬────────────┬──────────┬──────────┐   │
│    │ id │ description │ start_time │ end_time │ (active?)│   │
│    └────┴─────────────┴────────────┴──────────┴──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

### Backend
| Tecnologia | Versão | Papel |
|---|---|---|
| Java | 17 | Linguagem principal |
| Spring Boot | 3.2.2 | Framework web |
| Spring Security | 6.x | Autenticação e autorização |
| Spring Data JPA | 3.x | Persistência de dados |
| PostgreSQL | 17 | Banco de dados em produção |
| H2 Database | — | Banco em memória para dev |
| Lombok | — | Redução de boilerplate |
| Maven | 3.8.5 | Gerenciamento de dependências |

### Frontend
| Tecnologia | Versão | Papel |
|---|---|---|
| React | 18 | Framework UI |
| TypeScript | 5.5 | Tipagem estática |
| Vite | 7.x | Build tool e dev server |
| TailwindCSS | 3.4 | Estilização |
| React Router | 6.x | Roteamento SPA |
| Axios | 1.6 | Cliente HTTP |
| Lucide React | — | Ícones |

### Infraestrutura
| Tecnologia | Uso |
|---|---|
| Docker | Containerização do backend |
| Docker Compose | Orquestração local (backend + PostgreSQL) |
| Render | Hospedagem do backend em produção |
| Vercel | Hospedagem do frontend em produção |
| Neon | Banco de dados PostgreSQL em produção |

---

## � Pré-requisitos

Certifique-se de ter instalado:

- **[Java 17+](https://adoptium.net/)** — para o backend
- **[Maven 3.8+](https://maven.apache.org/)** — gerenciador de build do backend
- **[Node.js 18+](https://nodejs.org/)** — para o frontend
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** — para subir o banco de dados localmente
- **[Git](https://git-scm.com/)** — controle de versão

---

## 🏃 Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/Caholive1ra/Programa-de-rastreamento.git
cd Programa-de-rastreamento
```

### 2. Configure as variáveis de ambiente

```bash
# Na raiz do projeto
cp .env.example .env

# Edite o .env com seus valores
```

> Veja a seção [Variáveis de Ambiente](#-variáveis-de-ambiente) para mais detalhes.

### 3. Suba o banco de dados com Docker

```bash
docker-compose up postgres -d
```

Isso iniciará um container PostgreSQL na porta `5532`.

### 4. Rode o Backend

```bash
cd backend

# Windows
run-local.bat

# Linux/macOS
mvn spring-boot:run
```

O servidor estará disponível em `http://localhost:8080`.

### 5. Rode o Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> Alternativamente, na raiz do projeto, execute `start_frontend.bat` (Windows).

---

## 🔧 Variáveis de Ambiente

### Arquivo `.env` na raiz do projeto (para Docker Compose)

```dotenv
# =============================================
# BANCO DE DADOS (PostgreSQL)
# =============================================
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5532/gestao-hrs
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=sua_senha_segura

# =============================================
# SENHAS DOS USUÁRIOS (hasheadas com BCrypt)
# =============================================
# Gere hashes em: https://bcrypt-generator.com/
APP_ADMIN_PASSWORD=$2a$10$SUA_HASH_DO_ADMIN_AQUI
APP_CLIENT_PASSWORD=$2a$10$SUA_HASH_DO_CLIENT_AQUI

# =============================================
# CORS
# =============================================
CORS_ALLOWED_ORIGINS=http://localhost:5173

# =============================================
# POSTGRES LOCAL (Docker Compose)
# =============================================
POSTGRES_PASSWORD=senha_postgres_local
```

### Arquivo `.env.local` no diretório `frontend/`

```dotenv
VITE_API_URL=http://localhost:8080
```

> ⚠️ **Nunca commite o arquivo `.env`!** Ele está no `.gitignore`.

---

## � API Reference

**Base URL:** `http://localhost:8080`

**Autenticação:** Basic Auth (`Authorization: Basic base64(usuario:senha)`)

### 🔐 Autenticação

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| `POST` | `/api/auth/login` | ❌ Pública | Realiza login e retorna usuário e perfil |
| `GET` | `/api/auth/me` | ✅ Qualquer | Retorna dados do usuário autenticado |

**Exemplo — Login:**
```json
// POST /api/auth/login
// Body:
{
  "username": "admin",
  "password": "sua_senha"
}

// Response 200 OK:
{
  "username": "admin",
  "role": "ADMIN"
}
```

---

### ⏱️ Sessões de Trabalho

| Método | Endpoint | Auth | Permissão | Descrição |
|--------|----------|------|-----------|-----------|
| `GET` | `/api/sessions` | ✅ | ADMIN, CLIENT | Lista todas as sessões |
| `GET` | `/api/sessions/active` | ✅ | ADMIN, CLIENT | Retorna a sessão ativa (ou `204`) |
| `GET` | `/api/sessions/stats` | ✅ | ADMIN, CLIENT | Retorna estatísticas de horas |
| `POST` | `/api/sessions/start` | ✅ | **ADMIN only** | Inicia nova sessão |
| `POST` | `/api/sessions/stop` | ✅ | **ADMIN only** | Para a sessão ativa |

**Exemplo — Iniciar sessão:**
```json
// POST /api/sessions/start
// Body:
{
  "description": "Desenvolvimento da feature de login"
}

// Response 201 Created:
{
  "id": 42,
  "description": "Desenvolvimento da feature de login",
  "startTime": "2026-02-26T10:00:00",
  "endTime": null
}
```

**Exemplo — Estatísticas:**
```json
// GET /api/sessions/stats
// Response 200 OK:
{
  "totalHoursWorked": 12.75,
  "contractedHours": 60
}
```

---

## 📁 Estrutura do Projeto

```
programa_rastreamento/
│
├── 📄 docker-compose.yml       # Orquestração: backend + PostgreSQL
├── 📄 Dockerfile               # Build multi-stage do backend
├── 📄 render.yaml              # Configuração de deploy no Render
├── 📄 .env.example             # Template de variáveis de ambiente
│
├── 📂 backend/                 # API REST Spring Boot
│   ├── 📄 pom.xml              # Dependências Maven
│   └── � src/main/java/com/tracker/
│       ├── 📄 RetainerDashboardApplication.java   # Entry point
│       ├── 📂 config/
│       │   ├── 📄 SecurityConfig.java             # Spring Security + CORS
│       │   └── 📄 WebConfig.java                  # Configurações web
│       ├── 📂 controller/
│       │   ├── 📄 AuthController.java             # Endpoints de autenticação
│       │   └── 📄 TrackerController.java          # Endpoints de sessões
│       ├── 📂 entity/
│       │   └── 📄 WorkSession.java                # Entidade JPA
│       ├── 📂 repository/
│       │   └── 📄 WorkSessionRepository.java      # Queries JPA
│       └── 📂 service/
│           ├── 📄 AuthService.java                # Lógica de autenticação
│           ├── 📄 TrackerService.java             # Lógica de negócio
│           └── 📄 UserDetailService.java          # Usuários em memória
│
└── 📂 frontend/                # SPA React + TypeScript
    ├── 📄 package.json
    ├── 📄 vite.config.ts
    ├── 📄 tailwind.config.js
    └── 📂 src/
        ├── 📄 App.tsx                             # Rotas e autenticação
        ├── 📂 pages/
        │   ├── 📄 LoginPage.tsx                   # Tela de login
        │   ├── 📄 AdminDashboard.tsx              # Painel do admin
        │   └── 📄 ClientDashboard.tsx             # Painel do cliente
        ├── 📂 services/
        │   └── 📄 api.ts                          # Cliente HTTP (Axios)
        └── 📂 types/
            └── 📄 index.ts                        # Tipos TypeScript
```

---

## 🚀 Deploy em Produção

O projeto está configurado para deploy gratuito usando três serviços:

```
┌─────────┐        ┌────────────────────┐        ┌──────────────┐
│  Vercel │  ────▶  │      Render        │  ────▶  │     Neon     │
│(Frontend)│        │    (Backend API)   │        │  (PostgreSQL)│
└─────────┘        └────────────────────┘        └──────────────┘
```

### Frontend → Vercel
1. Importe o repositório no [Vercel](https://vercel.com)
2. Configure o diretório raiz como `frontend/`
3. Adicione a variável de ambiente:
   ```
   VITE_API_URL=https://sua-api.onrender.com
   ```

### Backend → Render
1. Conecte o repositório no [Render](https://render.com)
2. O `render.yaml` já define tudo automaticamente
3. Configure as variáveis de ambiente no painel do Render (veja `.env.example`)

### Banco de Dados → Neon
1. Crie um banco no [Neon](https://neon.tech) (plano gratuito)
2. Copie a Connection String e use como `SPRING_DATASOURCE_URL`

---

## 🔐 Segurança

- **Senha com BCrypt:** As senhas dos usuários nunca são armazenadas em texto plano — apenas o hash BCrypt.
- **HTTP Basic Auth:** Cada requisição autenticada envia o token `Authorization: Basic base64(user:pass)`.
- **CORS configurável:** As origens permitidas são controladas via variável de ambiente `CORS_ALLOWED_ORIGINS`.
- **CSRF desabilitado:** Configuração adequada para APIs stateless consumidas por SPAs.
- **Autorização por papel:** Endpoints de escrita (`POST`) são exclusivos para `ADMIN`; endpoints de leitura (`GET`) são acessíveis a `ADMIN` e `CLIENT`.
- **Variáveis de ambiente:** Nenhuma credencial é hardcodada no código — tudo via `.env`.

---

## 👥 Usuários Padrão

| Usuário | Perfil | Permissões |
|---------|--------|------------|
| `admin` | ADMIN | Iniciar/parar timer, ver tudo |
| `client` | CLIENT | Somente leitura e visualização |

> As senhas são definidas via variáveis de ambiente (`APP_ADMIN_PASSWORD` e `APP_CLIENT_PASSWORD`) como hashes BCrypt.

---

<div align="center">

Desenvolvido com ❤️ por **[Caholive1ra](https://github.com/Caholive1ra)**

</div>
