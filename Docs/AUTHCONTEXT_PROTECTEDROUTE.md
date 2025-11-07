# 🔐 Guia - AuthContext e ProtectedRoute

## 📋 Índice
1. [AuthContext](#authcontext)
2. [ProtectedRoute](#protectedroute)
3. [Fluxo de Autenticação](#fluxo-de-autenticação)
4. [Como Usar](#como-usar)
5. [Exemplos Práticos](#exemplos-práticos)

---

## 🔑 AuthContext

### O que é?
**AuthContext** é um **Context da API do React** que gerencia o estado global de autenticação da aplicação. Ele centraliza a lógica de login, logout e gerenciamento de tokens JWT.

### Localização
```
frontend/movie/src/contexts/AuthContext.tsx
```

### Estrutura

#### 1. **Interface User**
```typescript
export interface User {
  username: string;
  id: number;
}
```
Define os dados do usuário logado.

#### 2. **Interface AuthContextType**
```typescript
interface AuthContextType {
  user: User | null;                    // Usuário logado ou null
  token: string | null;                 // Token JWT ou null
  isAuthenticated: boolean;             // true se logado
  isLoading: boolean;                   // true enquanto carrega sessão
  login: (username: string, password: string) => Promise<void>;  // Fazer login
  logout: () => void;                   // Fazer logout
}
```

Define todas as propriedades e métodos disponíveis no contexto.

### Funcionalidades Principais

#### 🔓 **login(username, password)**
Autentica o usuário no backend.

```typescript
const login = useCallback(async (username: string, password: string) => {
  try {
    // 1. Enviar credenciais para /token/
    const response = await api.post('/token/', { username, password });
    const { access, refresh } = response.data;

    // 2. Salvar tokens em localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    // 3. Adicionar token ao header padrão de todas requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    // 4. Atualizar estado
    setToken(access);
    setUser({ username, id: 0 });
  } catch (error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw new Error('Credenciais inválidas');
  }
}, []);
```

**O que acontece**:
1. POST para `http://localhost:8000/token/`
2. Backend valida credenciais
3. Backend retorna `access_token` e `refresh_token`
4. Frontend salva tokens em localStorage
5. Frontend adiciona token ao header: `Authorization: Bearer {token}`
6. Estado é atualizado com dados do usuário

#### 🔒 **logout()**
Remove autenticação e limpa dados.

```typescript
const logout = useCallback(() => {
  // 1. Remover tokens do localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
  // 2. Remover token do header padrão
  delete api.defaults.headers.common['Authorization'];
  
  // 3. Limpar estado
  setToken(null);
  setUser(null);
}, []);
```

**O que acontece**:
1. Tokens deletados de localStorage
2. Token removido do header padrão
3. Estado limpo

#### 💾 **Recuperação de Sessão (useEffect)**
Quando a página recarrega, o token é recuperado.

```typescript
useEffect(() => {
  const storedToken = localStorage.getItem('access_token');
  if (storedToken) {
    setToken(storedToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    setUser({ username: 'usuário', id: 0 });
  }
  setIsLoading(false);
}, []);
```

**O que acontece**:
1. Ao montar o componente, procura por token em localStorage
2. Se encontrar, restaura o token
3. Adiciona token ao header
4. Define isLoading como false

### Hook Customizado: `useAuth()`

Para usar o contexto em qualquer componente:

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
```

**Uso**:
```typescript
const { user, token, isAuthenticated, login, logout } = useAuth();
```

---

## 🛡️ ProtectedRoute

### O que é?
**ProtectedRoute** é um componente que protege rotas, impedindo acesso sem autenticação. Funciona como um "guardião" das páginas.

### Localização
```
frontend/movie/src/components/ProtectedRoute.tsx
```

### Código

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Se está carregando sessão anterior, mostrar spinner
  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-white text-lg font-semibold">Carregando...</p>
        </div>
      </div>
    );
  }

  // 2. Se não está autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se está autenticado, renderizar a página
  return children;
};
```

### Lógica de Funcionamento

```
ProtectedRoute verifica:

┌─────────────────────────────┐
│ isLoading === true?         │
├─────────────────────────────┤
│ SIM → Mostrar spinner       │
│ NÃO → Continuar verificação │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│ isAuthenticated === true?   │
├─────────────────────────────┤
│ SIM → Renderizar children   │
│ NÃO → Redirecionar /login   │
└─────────────────────────────┘
```

### Estados

#### ✅ Autenticado
```
1. localStorage tem access_token
2. isLoading = false
3. isAuthenticated = true
4. ProtectedRoute renderiza página (children)
```

#### ⏳ Carregando Sessão
```
1. App iniciou
2. Verificando localStorage por token
3. isLoading = true
4. ProtectedRoute mostra spinner
```

#### ❌ Não Autenticado
```
1. localStorage NÃO tem access_token
2. isLoading = false
3. isAuthenticated = false
4. ProtectedRoute redireciona para /login
```

---

## 🔄 Fluxo de Autenticação

### Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário acessa http://localhost:5173                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. AuthProvider envolve a app (recupera sessão anterior)    │
│    useEffect busca localStorage por token                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. App tenta ir para / (rota protegida)                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. ProtectedRoute verifica isAuthenticated                 │
│    - SIM (token existe) → Renderiza HomePage              │
│    - NÃO (sem token) → Redireciona para /login             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. LoginPage carrega com formulário                        │
│    Username + Password                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Usuário clica "Entrar"                                  │
│    LoginPage chama login(username, password)               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. AuthContext.login():                                     │
│    POST http://localhost:8000/token/                        │
│    { username: 'admin', password: 'admin123' }             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Backend valida credenciais e retorna tokens             │
│    { access: 'jwt_token...', refresh: 'refresh_token...' } │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. AuthContext salva em localStorage:                       │
│    access_token = 'jwt_token...'                            │
│    refresh_token = 'refresh_token...'                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. AuthContext atualiza header:                            │
│     Authorization: Bearer jwt_token...                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 11. AuthContext atualiza estado:                            │
│     isAuthenticated = true                                  │
│     user = { username: 'admin', id: 0 }                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 12. LoginPage redireciona para /                            │
│     navigate('/')                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 13. ProtectedRoute verifica isAuthenticated                │
│     true → Renderiza HomePage                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 14. HomePage + NavBar carregam                             │
│     NavBar mostra "Bem-vindo, admin"                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 15. ✅ USUÁRIO AUTENTICADO!                                │
│     Pode acessar todas rotas protegidas                     │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Logout

```
1. Usuário clica "Sair" na NavBar
        ↓
2. NavBar chama logout()
        ↓
3. AuthContext.logout():
   - Remove localStorage.access_token
   - Remove localStorage.refresh_token
   - Remove header Authorization
   - Define isAuthenticated = false
        ↓
4. NavBar redireciona para /login
        ↓
5. ProtectedRoute verifica isAuthenticated
   false → Redireciona para /login
        ↓
6. ✅ LOGOUT COMPLETO!
```

---

## 📱 Como Usar

### 1. Envolver App com AuthProvider

**App.tsx**:
```typescript
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          {/* Rotas e componentes */}
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};
```

**Por que?** AuthProvider deve estar no nível mais alto para que todos componentes tenham acesso ao contexto.

### 2. Proteger Rotas com ProtectedRoute

**App.tsx**:
```typescript
import { ProtectedRoute } from './components/ProtectedRoute';

<Routes>
  {/* Rota pública */}
  <Route path="/login" element={<LoginPage />} />

  {/* Rotas protegidas */}
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <MovieList />
      </ProtectedRoute>
    }
  />
  
  <Route
    path="/manage"
    element={
      <ProtectedRoute>
        <ManageMoviesPage />
      </ProtectedRoute>
    }
  />
</Routes>
```

### 3. Usar Hook useAuth em Componentes

**NavBar.tsx**:
```typescript
import { useAuth } from '../contexts/AuthContext';

export function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <span>Bem-vindo, {user?.username}</span>
      <button onClick={logout}>Sair</button>
    </nav>
  );
}
```

**LoginPage.tsx**:
```typescript
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      // Erro de autenticação
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulário */}
    </form>
  );
}
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Acessar Dados do Usuário Logado

```typescript
function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Faça login primeiro</p>;
  }

  return (
    <div>
      <p>Usuário: {user?.username}</p>
      <p>ID: {user?.id}</p>
    </div>
  );
}
```

### Exemplo 2: Verificar se Está Autenticado

```typescript
function MyComponent() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Você está logado ✅</p>
      ) : (
        <p>Você não está logado ❌</p>
      )}
    </div>
  );
}
```

### Exemplo 3: Fazer Login Programaticamente

```typescript
function CustomLogin() {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('admin', 'admin123');
      console.log('Login bem-sucedido!');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'Entrando...' : 'Entrar'}
    </button>
  );
}
```

### Exemplo 4: Logout Automático

```typescript
function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Sair</button>;
}
```

---

## 🔍 Verificação de Funcionamento

### No DevTools (F12)

#### 1. **Network Tab** - Verificar requisição de token
```
1. Abrir F12 → Network
2. Fazer login
3. Procurar por: POST /token/
4. Ver Response com access_token
```

#### 2. **Application Tab** - Verificar localStorage
```
1. Abrir F12 → Application → LocalStorage
2. Ver access_token e refresh_token salvos
3. Após logout, devem ser removidos
```

#### 3. **Network Tab** - Verificar header Authorization
```
1. Após login, fazer qualquer requisição
2. Clicar em uma requisição qualquer
3. Ir em Headers → Request Headers
4. Ver: Authorization: Bearer {token}
```

---

## ⚠️ Erros Comuns

### Erro: "useAuth deve ser usado dentro de AuthProvider"
**Causa**: Componente não está dentro de AuthProvider
**Solução**: Garantir que AuthProvider envolve toda a app em App.tsx

### Erro: "Cannot POST /token/"
**Causa**: Endpoint não existe ou URL errada
**Solução**: Verificar que backend está em http://localhost:8000 e endpoint é `/token/`

### Erro: "Invalid credentials"
**Causa**: Username ou password incorretos
**Solução**: Usar credenciais certas: admin/admin123

### Erro: "Token expirado"
**Causa**: Access token expirou (15 minutos por padrão)
**Solução**: Fazer logout e login novamente

---

## 📊 Resumo Visual

```
┌─────────────────────────────────────────────┐
│          AUTHCONTEXT                        │
├─────────────────────────────────────────────┤
│ • Gerencia estado global de autenticação   │
│ • Funções: login(), logout()                │
│ • Propriedades: user, token, isAuth...      │
│ • Hook: useAuth() para acessar             │
└─────────────────────────────────────────────┘
            ↑                    ↓
      Fornece dados         Usa dados
            ↑                    ↓
┌─────────────────────────────────────────────┐
│       PROTECTEDROUTE                        │
├─────────────────────────────────────────────┤
│ • Verifica autenticação                     │
│ • Redireciona se não autenticado            │
│ • Mostra spinner enquanto carrega           │
│ • Renderiza página se autenticado          │
└─────────────────────────────────────────────┘
            ↓
   Protege rotas (/, /manage, etc)
```

---

**Status**: ✅ AuthContext e ProtectedRoute Implementados e Documentados
**Data**: Novembro de 2025
