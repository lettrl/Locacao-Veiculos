# Locação de Veículos

Sistema web de locação de veículos com autenticação JWT, desenvolvido com Node.js, Express, Prisma ORM e React.

## Integrantes

| Nome | Responsabilidade |
|---|---|
| Letícia | Schema Prisma, migrations, middleware de autenticação, services |
| Eduardo | Backend (app, rotas, controllers), frontend base (AuthContext, Login, Cadastro, Locações) |
| Henrique | Tela de Veículos (React), validações de ID, seed, .env.example, README, demo |

## Funcionalidades

- Cadastro e login de usuários com senha criptografada (bcrypt)
- Autenticação via JWT em todas as rotas protegidas
- Cadastro de veículos com validação de placa única
- Listagem de veículos com filtro de disponibilidade
- Registro de locação com bloqueio de concorrência via transação atômica
- Cálculo de diárias (qualquer fração de 24 h conta como diária inteira)
- Finalização de locação com liberação automática do veículo

## Requisitos

- Node.js 18+
- MySQL 8+

## Instalação

```bash
# Clone o repositório
git clone https://github.com/lettrl/Locacao-Veiculos.git
cd Locacao-Veiculos
```

### Backend

```bash
cd backend
npm install
npx prisma generate
```

Copie `.env.example` para `.env` e preencha as variáveis:

```bash
cp .env.example .env
```

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/locacao_veiculos"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

Execute a migration e o seed:

```bash
npx prisma migrate dev
npm run seed
```

Suba o servidor:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

## API

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/registrar` | ✗ | Cadastra usuário |
| POST | `/auth/login` | ✗ | Autentica e retorna token JWT |
| GET | `/auth/perfil` | ✓ | Retorna dados do usuário logado |
| POST | `/veiculos` | ✓ | Cadastra veículo |
| GET | `/veiculos?disponiveis=true` | ✓ | Lista veículos (filtro opcional) |
| POST | `/locacoes` | ✓ | Registra locação |
| GET | `/locacoes` | ✓ | Lista locações do usuário |
| PATCH | `/locacoes/:id/finalizar` | ✓ | Finaliza locação |

## Decisões Técnicas

### Bloqueio de concorrência na locação

O campo `disponivel` do veículo é atualizado com `updateMany` condicional (`where: { disponivel: true }`) dentro de uma transação. Se a contagem retornar 0, o veículo já foi reservado por outra requisição concorrente e a API responde 409. Essa abordagem elimina a janela de tempo entre verificar e atualizar, sem necessidade de locks manuais.

### Cálculo de diárias

O valor total é calculado com `Math.ceil((fim - inicio) / DIA_MS)`, onde `DIA_MS = 24 * 60 * 60 * 1000`. Qualquer fração de 24 horas é cobrada como uma diária inteira.

### Tipos Decimal

`valorDiaria` e `valorTotal` são armazenados como `Decimal(10, 2)` no MySQL e chegam ao cliente como string via Prisma. O frontend converte com `Number(...)` antes de formatar exibição.

### Validação de IDs

IDs recebidos via corpo ou parâmetro de rota são validados com `Number.isInteger` e verificação de valor positivo antes de qualquer consulta ao banco, evitando que strings como `"abc"` cheguem ao Prisma e causem erro 500 em vez de 400.

### Sem comentários no código

As decisões de implementação estão documentadas exclusivamente neste README, conforme requisito do projeto.

## Seed

O script `prisma/seed.js` cria:
- 1 usuário de teste: `demo@locacao.com` / `senha123`
- 6 veículos variados (econômicos e premium)

Usa `upsert` em todos os registros: pode ser executado múltiplas vezes sem duplicar dados.

```bash
npm run seed
```
