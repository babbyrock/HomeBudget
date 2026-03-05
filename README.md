# HomeBudget API

Desenvolvi uma API REST completa para gerenciamento de finanças domésticas. A solução foi estruturada em camadas separadas (Domain, Application, Persistence e API).

Utilizei CQRS com MediatR para separar as operações de leitura e escrita, Mapster para mapeamento entre entidades e DTOs, FluentValidation para validação das entradas e Entity Framework Core para persistência dos dados.

A API tem cadastro de pessoas, categorias e transações financeiras, com regras de negócio como restrição de receitas para menores de idade e validação de compatibilidade entre categoria e tipo de transação. Também implementei consultas de totais por pessoa e por categoria, com paginação em todos os endpoints de listagem.

## Tecnologias

- .NET 10
- Entity Framework Core
- SQL Server
- MediatR
- Mapster
- FluentValidation
- Swashbuckle (Swagger)


## Como executar


As migrations são aplicadas automaticamente ao iniciar a aplicação. Caso prefira aplicar manualmente:
```bash
cd HomeBudget.API
dotnet ef database update
```


## Estrutura do projeto
```
HomeBudget/
├── HomeBudget.Domain          # Entidades, interfaces e enums
├── HomeBudget.Application     # Handlers, Commands, Queries e DTOs
├── HomeBudget.Persistence     # Repositórios, configurações e migrations
└── HomeBudget.API             # Controllers, configurações e Program.cs
```

## Endpoints disponíveis

- `POST/GET/PUT/DELETE /api/pessoas`
- `POST/GET /api/categorias`
- `POST/GET /api/transacoes`
- `GET /api/pessoas/totais`
- `GET /api/categorias/totais`


# HomeBudget — Frontend

Sistema de controle financeiro residencial desenvolvido com React, TypeScript. Criei esse projeto para gerenciar pessoas, categorias e transações financeiras, com relatórios de totais por pessoa e por categoria.

## O que foi desenvolvido

- CRUD completo de pessoas, categorias e transações
- Paginação em todas as listagens
- Regra de negócio: menores de 18 anos só podem registrar despesas
- Relatórios financeiros por pessoa e por categoria
- Validação de formulários com Zod e React Hook Form
- Gerenciamento de estado com Zustand e cache de dados com React Query
- Integração com API REST em .NET com axios


## Pré-requisitos

- Node.js 18+
- npm ou yarn
- API backend rodando em `https://localhost:7110`

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/homebudget.git
cd homebudget/front
npm install
```

```bash
npm run dev
```
