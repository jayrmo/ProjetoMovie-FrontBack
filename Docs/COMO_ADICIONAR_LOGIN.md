# 🔐 COMO ADICIONAR AUTENTICAÇÃO JWT (Login)

## ⚠️ IMPORTANTE

O backend está **100% pronto para JWT**. Este documento explica como adicionar UI de login se o professor pedir.

---

## 1️⃣ VERIFICAR BACKEND (Já Está Pronto)

### Settings.py - JWT Configurado
```python
# web2-Ava1/moviematch/settings.py

INSTALLED_APPS = [
    ...
    'rest_framework_simplejwt',  # ✅ INSTALADO
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

### URLs.py - Endpoints de Token
```python
# Verificar se tem:
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

---

## 2️⃣ TESTAR BACKEND (No Terminal)

### Gerar Token (Curl)
```bash
curl -X POST http://localhost:8000/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seu_usuario",
    "password": "sua_senha"
  }'
```

**Resposta Esperada**:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## 3️⃣ CRIAR AUTHCONTEXT (Frontend)

Criar arquivo: `frontend/movie/src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api_v1 } from '../services/api';

interface User {
  username: string;
  id: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recuperar token do localStorage ao montar
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
      // Validar token chamando um endpoint protegido
      validateToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      // Adicionar token ao header
      api_v1.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Chamar endpoint que requer autenticação
      const response = await api_v1.get('/profile/'); // Ajustar conforme seu backend
      setUser(response.data);
    } catch (error) {
      console.error('Token inválido');
      localStorage.removeItem('access_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await api_v1.post('/token/', { username, password });
      const { access, refresh } = response.data;

      // Salvar tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Adicionar ao header
      api_v1.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setToken(access);

      // Buscar dados do usuário (ajustar conforme seu backend)
      setUser({ username, id: 0 }); // Placeholder
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api_v1.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
```

---

## 4️⃣ CRIAR PÁGINA DE LOGIN

Criar arquivo: `frontend/movie/src/pages/LoginPage.tsx`

```typescript
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);
      addNotification('Login realizado com sucesso!', 'success');
      navigate('/');
    } catch (error) {
      addNotification('Usuário ou senha inválidos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen w-full flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">
            MovieMatch
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-red-600 outline-none"
                placeholder="Seu usuário"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-red-600 outline-none"
                placeholder="Sua senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

## 5️⃣ CRIAR COMPONENTE PROTEGIDO

Criar arquivo: `frontend/movie/src/components/ProtectedRoute.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
```

---

## 6️⃣ ATUALIZAR APP.TSX

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotificationPanel } from './components/NotificationPanel';
import { MovieList } from './pages/MovieList';
import { ManageMoviesPage } from './pages/ManageMoviesPage';
import { EditMoviePage } from './pages/EditMoviePage';
import { LoginPage } from './pages/LoginPage';

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BrowserRouter>
          <NotificationPanel />
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
            <Route
              path="/movies/:id/edit"
              element={
                <ProtectedRoute>
                  <EditMoviePage />
                </ProtectedRoute>
              }
            />

            {/* Rota padrão */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
```

---

## 7️⃣ ADICIONAR LOGOUT

Atualizar `App.tsx` ou criar `NavBar.tsx`:

```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-red-600 text-2xl font-bold">MovieMatch</h1>
      <div className="flex items-center gap-4">
        <span className="text-white">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
```

---

## 8️⃣ CRIAR USUÁRIO DE TESTE

```bash
# No terminal do backend
python manage.py createsuperuser
# Seguir instruções para criar usuário
```

### Credenciais Teste:
```
Usuário: admin
Senha: admin123
```

---

## 9️⃣ TESTAR FLUXO

1. Acessar http://localhost:5173
2. Deve redirecionar para `/login`
3. Fazer login com credenciais
4. Deve ir para homepage
5. Clicar logout
6. Deve ir para login

---

## 🔟 POSSÍVEIS ERROS

### Erro: "CORS não permitido"
**Solução** - Adicionar em `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### Erro: "Token inválido"
**Solução** - Verificar `secret_key` do Django está correto em `settings.py`

### Erro: "Endpoint não existe"
**Solução** - Ajustar URL do endpoint para qual seu backend realmente tem

---

## ✅ QUANDO NÃO USAR LOGIN

Se o foco da avaliação é em:
- ✅ Integração API
- ✅ Estrutura do projeto
- ✅ Componentes reutilizáveis
- ✅ Boas práticas

Então login não é necessário. O backend estar preparado é suficiente.

---

**Nota**: Este documento é uma referência. Use apenas se o professor pedir autenticação.
