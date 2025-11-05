# 🎬 MovieMatch - Sistema de Gerenciamento de Filmes

Um sistema completo de gerenciamento de filmes com **soft delete**, **classificação por categoria**, **notificações em tempo real** e interface moderna. Desenvolvido com Django REST Framework no backend e React no frontend.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [API Endpoints](#api-endpoints)

---

## 🎯 Visão Geral

MovieMatch é uma aplicação web para gerenciar uma coleção de filmes. Permite:
- ✅ Criar, editar, visualizar e deletar filmes
- ✅ Organizar filmes por gênero/categoria
- ✅ Soft delete com possibilidade de restauração
- ✅ Sistema de notificações em tempo real
- ✅ Interface responsiva e moderna
- ✅ Carregamento otimizado sem page reload

---

## 🛠️ Tecnologias

### **Backend**
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Django** | 5.2.6 | Framework web Python |
| **Django REST Framework** | 3.16.1 | API REST para Django |
| **PostgreSQL** | - | Banco de dados relacional |
| **psycopg2-binary** | 2.9.10 | Driver PostgreSQL |
| **DRF Spectacular** | 0.28.0 | Documentação automática OpenAPI/Swagger |
| **SimpleJWT** | 5.5.1 | Autenticação JWT |

### **Frontend**
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React** | 19.1.1 | Biblioteca de UI |
| **TypeScript** | - | JavaScript tipado |
| **React Router** | 7.9.5 | Roteamento de páginas |
| **Axios** | 1.13.2 | Cliente HTTP |
| **Tailwind CSS** | 3.x | Framework CSS utilitário |
| **Vite** | - | Build tool moderno |

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Python** 3.10+
- **Node.js** 18+ com npm
- **PostgreSQL** 12+
- **Git**

### Verificar instalações:
```powershell
python --version
node --version
npm --version
psql --version
```

---

## 🚀 Instalação

### 1️⃣ Clonar o Repositório
```powershell
git clone https://github.com/jayrmo/web2-Ava1.git
cd web2-Ava1
```

### 2️⃣ Configurar Backend (Django)

#### Criar ambiente virtual
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### Instalar dependências
```powershell
pip install -r requirements.txt
```

#### Criar arquivo `.env`
Na raiz do projeto `web2-Ava1/`, criar `.env`:
```env
DEBUG=True
SECRET_KEY=sua-chave-secreta-aqui
DB_ENGINE=django.db.backends.postgresql
DB_NAME=moviematch_db
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```

#### Executar Migrações
```powershell
python manage.py makemigrations
python manage.py migrate
```

#### Criar Superusuário (Admin)
```powershell
python manage.py createsuperuser
```

#### Iniciar Servidor Django
```powershell
python manage.py runserver
```
✅ Backend rodando em: `http://localhost:8000`

---

### 3️⃣ Configurar Frontend (React)

Abrir novo terminal na pasta `frontend/movie/`:

#### Instalar dependências
```powershell
cd frontend/movie
npm install
```

#### Configurar API
Editar `src/services/api.ts` e ajustar URL da API se necessário:
```typescript
const BASE_URL = 'http://localhost:8000/api/v1';
```

#### Iniciar Servidor de Desenvolvimento
```powershell
npm run dev
```
✅ Frontend rodando em: `http://localhost:5173`

---

## ⚙️ Configuração

### Banco de Dados PostgreSQL

#### Criar banco de dados
```sql
CREATE DATABASE moviematch_db;
```

#### Restaurar permissões (se necessário)
```sql
ALTER DATABASE moviematch_db OWNER TO seu_usuario;
```

### Variáveis de Ambiente

**Backend** (`web2-Ava1/.env`):
```env
DEBUG=True
SECRET_KEY=django-insecure-sua-chave-secreta
DB_ENGINE=django.db.backends.postgresql
DB_NAME=moviematch_db
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```

---

## 🎮 Execução

### Terminal 1 - Backend (Django)
```powershell
cd web2-Ava1
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

### Terminal 2 - Frontend (React)
```powershell
cd frontend/movie
npm run dev
```

### Acessar a Aplicação
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/v1
- **Admin Django**: http://localhost:8000/admin
- **Documentação API**: http://localhost:8000/api/schema/swagger-ui/

---

## 📁 Estrutura do Projeto

```
web2-Ava1/
├── app_core/
│   ├── models.py          # Modelos (Movie, Director, Actor, Genre)
│   ├── views.py           # Vistas
│   ├── admin.py           # Admin do Django
│   └── api/
│       └── v1/
│           ├── serializers.py   # Serializadores DRF
│           ├── viewsets.py      # ViewSets para API
│           └── router.py        # Roteamento API
├── moviematch/
│   ├── settings.py        # Configurações Django
│   ├── urls.py            # URLs principais
│   └── wsgi.py            # Configuração WSGI
├── manage.py              # Gerenciador Django
├── requirements.txt       # Dependências Python
└── README.md

frontend/movie/
├── src/
│   ├── components/
│   │   ├── MovieCard.tsx           # Componente de filme individual
│   │   ├── MoviesByGenre.tsx       # Agrupamento por categoria
│   │   └── NotificationPanel.tsx   # Painel de notificações
│   ├── contexts/
│   │   └── NotificationContext.tsx # Context de notificações
│   ├── pages/
│   │   ├── ManageMoviesPage.tsx    # Criar novo filme
│   │   └── EditMoviePage.tsx       # Editar filme
│   ├── services/
│   │   └── api.ts                  # Cliente Axios
│   ├── types.ts                    # Interfaces TypeScript
│   ├── App.tsx                     # Componente principal
│   ├── main.tsx                    # Entrada React
│   └── index.css                   # Estilos globais
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## ✨ Funcionalidades

### 🎬 Gerenciamento de Filmes
- **Criar Filme**: Adicionar novo filme com título, sinopse, data de lançamento
- **Editar Filme**: Modificar informações do filme
- **Deletar Filme**: Soft delete (dados preservados no banco)
- **Restaurar Filme**: Recuperar filmes deletados
- **Visualizar**: Grid responsivo com informações do filme

### 📂 Organização
- **Classificação por Gênero**: Filmes ativos agrupados por categoria
- **Lista Simples para Deletados**: Filmes deletados em lista simples sem agrupamento
- **Contagem por Categoria**: Badge mostrando quantidade de filmes

### 🔔 Notificações
- **Criação**: "Filme [NOME] criado com sucesso!"
- **Edição**: "Filme [NOME] atualizado com sucesso!"
- **Deleção**: "Filme [NOME] deletado com sucesso"
- **Restauração**: "Filme [NOME] restaurado com sucesso"
- **Erros**: Mensagens de erro em vermelho
- **Auto-dismiss**: Desaparecem após 5 segundos
- **Z-Index Alto**: Sempre visível sobre outros elementos

### 🎨 UI/UX
- **Interface Moderna**: Tailwind CSS com tema escuro
- **Responsiva**: Suporta desktop, tablet e mobile
- **Otimização**: Carregamento sem page reload (optimistic updates)
- **Loading States**: Indicadores visuais de carregamento

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8000/api/v1
```

### Filmes
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/movies/` | Listar todos os filmes |
| POST | `/movies/` | Criar novo filme |
| GET | `/movies/{id}/` | Obter filme específico |
| PUT | `/movies/{id}/` | Atualizar filme |
| DELETE | `/movies/{id}/` | Deletar filme (soft delete) |
| PATCH | `/movies/{id}/` | Atualização parcial |

### Diretores
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/directors/` | Listar diretores |
| POST | `/directors/` | Criar diretor |

### Atores
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/actors/` | Listar atores |
| POST | `/actors/` | Criar ator |

### Gêneros
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/genres/` | Listar gêneros |
| POST | `/genres/` | Criar gênero |

### Exemplo de Requisição
```bash
# Obter todos os filmes
curl -X GET http://localhost:8000/api/v1/movies/

# Criar novo filme
curl -X POST http://localhost:8000/api/v1/movies/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "release_date": "2010-07-16",
    "synopsis": "A thief who steals...",
    "url": "https://youtube.com/watch?v=...",
    "director_id": 1,
    "actor_ids": [1, 2],
    "genre_ids": [1, 2]
  }'
```

---

## 🔑 Padrões Implementados

### Soft Delete
- **Modelo Base**: `BaseModel` com field `is_deleted`
- **QuerySet Customizado**: Métodos `.active()` e `.deleted()`
- **Preservação de Dados**: Filmes não são realmente removidos do banco
- **Rastreamento**: Campo `deleted_by` registra quem deletou

### Optimistic Updates
- **UI Imediata**: Interface atualiza antes da resposta do servidor
- **Sem Page Reload**: Callbacks atualizam estado React
- **Performance**: Melhor experiência de usuário
- **Callbacks**: Funções passadas para componentes filhos

### Context API
- **NotificationContext**: Gerencia notificações globais
- **Provider Pattern**: Envolve a aplicação
- **useNotification Hook**: Acesso fácil em qualquer componente

---

## 📝 Scripts Úteis

### Backend
```powershell
# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Resetar banco (⚠️ CUIDADO)
python manage.py flush

# Shell interativo Django
python manage.py shell
```

### Frontend
```powershell
# Modo desenvolvimento
npm run dev

# Build produção
npm run build

# Preview build
npm run preview

# Lint código
npm run lint
```

---

## 🐛 Solução de Problemas

### Erro de Conexão ao PostgreSQL
```
psycopg2.OperationalError: could not connect to server
```
✅ **Solução**: Verifique se PostgreSQL está rodando e as credenciais no `.env`

### Porta 8000 já em uso
```powershell
python manage.py runserver 8001
```

### Porta 5173 já em uso
```powershell
npm run dev -- --port 5174
```

### Erro de CORS
✅ **Solução**: Adicionar domínio ao `CORS_ALLOWED_ORIGINS` em `settings.py`

---

## 👨‍💻 Desenvolvimento

### Criar Nova Componente React
```typescript
import { FC } from 'react';

interface Props {
  // definir props
}

const MeuComponente: FC<Props> = ({ props }) => {
  return (
    <div>
      {/* JSX aqui */}
    </div>
  );
};

export default MeuComponente;
```

### Criar Novo Model Django
```python
class MeuModel(BaseModel):
    field = models.CharField(max_length=100)
    
    objects = BaseManager()
    
    def __str__(self):
        return self.field
```

---

## 📄 Licença

Este projeto é parte de uma avaliação acadêmica.

---

## 👤 Autor

**Desenvolvido por**: Aluno do 4º Semestre - Web II

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da API em:
```
http://localhost:8000/api/schema/swagger-ui/
```

---

**Última atualização**: Novembro de 2025
