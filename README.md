# Projeto Faculdade - E-commerce

Um projeto de e-commerce completo desenvolvido com Next.js e Supabase, incluindo sistema de autenticação, gerenciamento de produtos, carrinho de compras e painel administrativo.

## Funcionalidades

### Para Clientes
- Autenticação de usuários (login/cadastro)
- Navegação de produtos com imagens
- Visualização detalhada de produtos
- Carrinho de compras com gerenciamento de quantidades
- Processo de checkout com validação de estoque
- Histórico de pedidos
- Página de perfil com informações do usuário

### Para Administradores
- Painel administrativo com resumo de vendas
- CRUD completo de produtos (criar, ler, atualizar, deletar)
- Upload de imagens de produtos
- Visualização de todos os pedidos
- Estatísticas de vendas (receita total, pedidos concluídos, pendentes)

## Tecnologias Utilizadas

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Backend/Database:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Storage:** Supabase Storage
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Validação:** Zod
- **Estilização:** Tailwind CSS
- **Componentes UI:** shadcn/ui

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Git

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositório>
cd projeto-faculdade
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

Você pode obter essas credenciais no painel do Supabase em: **Settings > API**

## Configuração do Banco de Dados

Execute os seguintes scripts SQL no Supabase SQL Editor, na ordem:

1. `database/products-table.sql` - Cria a tabela de produtos
2. `database/add-image-to-products.sql` - Adiciona suporte para imagens
3. `database/add-product-description.sql` - Adiciona descrição aos produtos
4. `database/storage-rls-policies.sql` - Cria o bucket de imagens
5. `database/create-cart-table.sql` - Cria a tabela de carrinho
6. `database/create-orders-tables.sql` - Cria as tabelas de pedidos
7. `database/create-profiles-table.sql` - Cria a tabela de perfis e roles
8. `database/update-products-rls.sql` - Atualiza políticas RLS de produtos
9. `database/update-orders-rls.sql` - Atualiza políticas RLS de pedidos
10. `database/backfill-existing-users.sql` - Cria perfis para usuários existentes (se aplicável)

### Configuração de Storage

As políticas de storage precisam ser configuradas via Dashboard do Supabase:

Siga as instruções no arquivo: `database/STORAGE_POLICIES_DASHBOARD.md`

## Configuração de Administrador

Para criar o primeiro usuário administrador:

1. Cadastre um usuário normalmente pela interface
2. Execute o script SQL:

```sql
update profiles
set role = 'admin'
where email = 'seu-email@example.com';
```

Instruções detalhadas em: `database/ADMIN_SETUP_INSTRUCTIONS.md`

## Estrutura do Projeto

```
projeto-faculdade/
├── app/                      # App Router do Next.js
│   ├── api/                  # API Routes
│   ├── cart/                 # Página do carrinho
│   ├── checkout/             # Página de checkout
│   ├── dashboard/            # Painel administrativo
│   ├── login/                # Página de login
│   ├── order/                # Visualização de pedidos
│   ├── product/              # Detalhes do produto
│   ├── products/             # Gerenciamento de produtos (admin)
│   ├── profile/              # Página de perfil
│   └── signup/               # Página de cadastro
├── components/               # Componentes React
│   ├── cart/                 # Componentes do carrinho
│   ├── layout/               # Layout (Navbar)
│   ├── products/             # Componentes de produtos
│   └── ui/                   # Componentes shadcn/ui
├── lib/                      # Lógica de negócio
│   ├── queries/              # React Query hooks
│   ├── repositories/         # Acesso ao banco de dados
│   ├── schemas/              # Schemas Zod
│   ├── services/             # Serviços (API calls)
│   ├── stores/               # Zustand stores
│   └── supabase/             # Cliente Supabase
├── types/                    # Definições TypeScript
└── database/                 # Scripts SQL
```

## Executando o Projeto

### Modo de Desenvolvimento
```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Build de Produção
```bash
npm run build
npm start
```

## Arquitetura

O projeto segue o padrão de arquitetura em camadas:

- **Presentation Layer:** Componentes React (app/, components/)
- **Data Access Layer:** React Query hooks (lib/queries/)
- **Service Layer:** Chamadas de API (lib/services/)
- **Repository Layer:** Acesso direto ao Supabase (lib/repositories/)
- **Type Safety:** TypeScript + Zod schemas

## Segurança

O projeto implementa múltiplas camadas de segurança:

- Row Level Security (RLS) no Supabase
- Verificação de role no middleware
- Validação de formulários com Zod
- Proteção de rotas admin (frontend + backend)
- Políticas de storage para upload de imagens

## Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Cria build de produção
npm start            # Inicia servidor de produção
npm run lint         # Executa linter
```

## Licença

Este projeto é um trabalho acadêmico.
