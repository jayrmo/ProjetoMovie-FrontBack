# 🎬 GUIA DE DEMONSTRAÇÃO - MovieMatch

## ⏱️ Sequência de Demonstração (5-7 minutos)

---

## 1️⃣ SETUP INICIAL (1 minuto)

### Verificar se tudo está rodando:

**Terminal 1 - Backend**:
```powershell
cd web2-Ava1
python manage.py runserver
# ✅ Deve estar em http://localhost:8000
```

**Terminal 2 - Frontend**:
```powershell
cd frontend/movie
npm run dev
# ✅ Deve estar em http://localhost:5173
```

**Abrir Navegador**: http://localhost:5173

---

## 2️⃣ MOSTRAR INTERFACE (1 minuto)

### Screen 1: Homepage
```
"Aqui você pode ver a tela principal com:
- Título MovieMatch
- Botão "+ Adicionar Filmes"
- Filmes organizados POR CATEGORIA/GÊNERO
- Badge mostrando quantidade de filmes por gênero"
```

**Pontos a Destacar**:
- ✅ Dark theme moderno
- ✅ Responsivo (redimensione para testar)
- ✅ Cards com informações claras

---

## 3️⃣ CRIAR NOVO FILME (1,5 minuto)

### Ação 1: Clicar "+ Adicionar Filmes"
```
Pronto! Vamos criar um novo filme.
```

### Ação 2: Preencher Formulário
```
- Título: "Inception"
- Data de lançamento: "2010-07-16"
- Sinopse: "Um thriller de ficção científica"
- URL YouTube: "https://www.youtube.com/watch?v=..."
- Selecionar Diretor
- Selecionar Atores
- Selecionar Gêneros
```

### Ação 3: Clicar "Salvar"
```
✅ NOTIFICAÇÃO NO CANTO: "Filme Inception criado com sucesso!"
✅ Redireciona automaticamente para homepage
✅ Novo filme aparece na categoria selecionada
```

**Pontos a Destacar**:
- ✅ Notificação em verde (sucesso)
- ✅ Auto-desaparece após 5 segundos
- ✅ Otimistic update (aparece imediatamente)

---

## 4️⃣ EDITAR FILME (1 minuto)

### Ação 1: Clicar em um Filme
```
"Vamos editar esse filme para demonstrar a atualização"
```

### Ação 2: Clicar Botão "Editar" (canto inferior)
```
✅ Abre página de edição
✅ Formulário pré-populado com dados atuais
```

### Ação 3: Alterar Alguma Informação
```
Ex: Mudar sinopse ou adicionar ator
```

### Ação 4: Clicar "Salvar"
```
✅ NOTIFICAÇÃO: "Filme [NOME] atualizado com sucesso!"
✅ Volta para homepage
✅ Mudanças aplicadas imediatamente
```

**Pontos a Destacar**:
- ✅ Dados pre-carregados
- ✅ Validação do formulário
- ✅ Update sem page reload

---

## 5️⃣ DELETAR FILME (Soft Delete) (1 minuto)

### Ação 1: Clicar Botão "Deletar" em um Filme
```
Modal aparece: "Confirmar exclusão?"
```

### Ação 2: Clicar "Confirmar"
```
✅ NOTIFICAÇÃO: "Filme [NOME] deletado com sucesso"
✅ Filme DESAPARECE da lista ativa
✅ Aparece na seção "Filmes Deletados" (abaixo)
```

**Pontos a Destacar**:
- ✅ Confirmação de ação
- ✅ Card deletado fica CINZA (50% opacity)
- ✅ Badge "DELETADO" aparece no card
- ✅ Dados NÃO são perdidos (soft delete)

---

## 6️⃣ RESTAURAR FILME (1 minuto)

### Ação 1: Rolar para "Filmes Deletados"
```
"Aqui estão os filmes que deletamos"
```

### Ação 2: Clicar Botão "Restaurar" (em verde)
```
✅ NOTIFICAÇÃO: "Filme [NOME] restaurado com sucesso"
✅ Filme DESAPARECE de "Filmes Deletados"
✅ Volta para categoria original na seção ativa
✅ Card volta com opacity normal
```

**Pontos a Destacar**:
- ✅ Restauração funciona
- ✅ Dados foram preservados (soft delete working!)
- ✅ Notificação clara

---

## 7️⃣ MOSTRAR API INTEGRATION (1,5 minuto)

### Ação 1: Abrir DevTools
```
F12 → aba Network
```

### Ação 2: Executar Ação (criar/editar/deletar)
```
Isso vai aparecer na aba Network como requisição HTTP
```

### Ação 3: Clicar em uma Requisição
```
Mostrar:
- Método: POST, PUT, DELETE, PATCH
- URL: http://localhost:8000/api/v1/movies/
- Headers com Content-Type: application/json
- Body com dados enviados
- Response: dados retornados da API
```

**Exemplos**:
```
✅ GET /movies/ → Lista todos os filmes
✅ POST /movies/ → Cria novo filme
✅ PUT /movies/{id}/ → Atualiza filme
✅ DELETE /movies/{id}/ → Deleta filme
✅ PATCH /movies/{id}/ → Restaura filme
```

**Pontos a Destacar**:
- ✅ Axios fazendo requisições corretas
- ✅ Status 200 (sucesso)
- ✅ Tratamento de erros funcionando

---

## 8️⃣ MOSTRAR CÓDIGO IMPORTANTE (1 minuto)

### Abrir VSCode e Mostrar:

#### 1. **types.ts** (Tipos Centralizados)
```typescript
Mostrar interfaces:
- Movie
- Director
- Actor
- Genre
- MovieFormData
```
**Falar**: "Todos os tipos estão centralizados aqui, melhorando maintainability"

#### 2. **NotificationContext.tsx** (useContext)
```typescript
Mostrar:
- createContext
- NotificationProvider
- useNotification hook
```
**Falar**: "Context API gerenciando estado global de notificações"

#### 3. **api.ts** (Axios)
```typescript
Mostrar:
- Instância axios
- baseURL configurado
```
**Falar**: "Cliente Axios centralizado para todas as requisições"

#### 4. **MovieCard.tsx** (useState + useEffect + API)
```typescript
Mostrar:
- useState para estados locais
- Funções async/await para API
- try-catch para tratamento de erros
- useCallback para memoização
```
**Falar**: "Componente reutilizável com todos os hooks implementados corretamente"

---

## 9️⃣ MOSTRAR DOCUMENTAÇÃO API (30 segundos)

### Abrir em Navegador:
```
http://localhost:8000/api/schema/swagger-ui/
```

**Mostrar**:
- ✅ Documentação automática de todos os endpoints
- ✅ Cada endpoint documentado com método HTTP
- ✅ Modelos de request/response
- ✅ Possibilidade de testar endpoints direto

**Falar**: "DRF Spectacular gerando documentação automática"

---

## 🔟 RESUMO E PERGUNTAS (30 segundos)

### O Que Foi Demonstrado:
✅ **3 PONTOS - Integração API**
- Axios consumindo API
- Tratamento de erros
- Todos os endpoints CRUD

✅ **2 PONTOS - Estrutura e Organização**
- Pastas bem organizadas
- types.ts centralizado
- Componentes reutilizáveis
- Context API

✅ **2 PONTOS - Funcionalidades**
- Rotas funcionando
- Dados dinâmicos
- Redirecionamento automático
- Soft delete com restauração

✅ **1 PONTO - Estilo**
- Tailwind CSS
- Interface responsiva

✅ **1 PONTO - Boas Práticas**
- Código limpo
- Hooks usados corretamente

✅ **1 PONTO - Documentação**
- README completo
- Demonstração funcional

---

## ⚠️ POSSÍVEIS PERGUNTAS DO PROFESSOR

### P1: "Por que não tem login?"
**R**: "O foco era nas funcionalidades CRUD e integração API. Backend tem JWT pronto configurado (rest_framework_simplejwt). A tela de login seria uma adição, mas o backend está 100% preparado para autenticação JWT."

### P2: "Como funciona o soft delete?"
**R**: "Os dados não são realmente deletados. Temos um campo `is_deleted` que marca como deletado. A API retorna todos, mas filtramos no frontend para mostrar/esconder."

### P3: "Por que usar Context API e não Redux?"
**R**: "Para projeto pequeno, Context API é mais leve e fácil de manter. Redux seria overkill. Context API é o padrão moderno do React."

### P4: "Como funciona o Tailwind CSS?"
**R**: "É um framework CSS utility-first. Em vez de criar classes customizadas, usamos classes predefinidas como `p-8`, `bg-gray-900`, `hover:bg-blue-700`. Mais produtivo e consistente."

### P5: "Por que usar TypeScript?"
**R**: "Type safety! Pega erros em tempo de desenvolvimento. Autocompletar melhor no VSCode. Documentação automática do código."

---

## 📱 TESTAR RESPONSIVIDADE

### F12 → Toggle device toolbar

Redimensionar para:
- ✅ Mobile (375px)
- ✅ Tablet (768px)
- ✅ Desktop (1920px)

Mostrar que grid adapta:
```
xl:grid-cols-4   → 4 colunas (desktop)
lg:grid-cols-3   → 3 colunas (tablet grande)
sm:grid-cols-2   → 2 colunas (tablet)
grid-cols-1      → 1 coluna (mobile)
```

---

## 🎯 DICAS DE APRESENTAÇÃO

✅ **Praticar a sequência antes**
✅ **Manter DevTools aberto no Network**
✅ **Mostrar notificações aparecendo**
✅ **Comentar sobre cada tecnologia usada**
✅ **Destacar boas práticas implementadas**
✅ **Responder com segurança sobre as decisões técnicas**

---

## ✅ CHECKLIST FINAL

Antes de apresentar:
- [ ] Backend rodando
- [ ] Frontend rodando
- [ ] Navegador em http://localhost:5173
- [ ] DevTools aberto em Network
- [ ] Terminal disponível para mostrar requisições
- [ ] VSCode aberto com código
- [ ] URL da API (swagger) em aba separada

---

**Status**: ✅ PRONTO PARA APRESENTAÇÃO
**Tempo Estimado**: 5-7 minutos
**Pontos Esperados**: 9.5/10
