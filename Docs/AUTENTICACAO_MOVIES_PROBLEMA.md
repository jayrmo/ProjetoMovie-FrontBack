# 🔐 Problema Resolvido: IsAuthenticated no MovieViewSet

## 📌 Problema

Ao ativar `permission_classes = [IsAuthenticated]` no `MovieViewSet`, as requisições falhavam e não carregavam a lista de filmes, mesmo com o usuário logado.

## 🔍 Causa Raiz

O **AuthContext** estava definindo o header de autorização apenas no axios client `api`:

```typescript
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

Mas as requisições de filmes usam o axios client `api_v1`:

```typescript
// services/api.ts
const api_v1 = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_V1_URL, // http://localhost:8000/api/v1/
});
```

**Resultado**: `api_v1` não tinha o token no header → Django rejeitava com 401 Unauthorized

## ✅ Solução Aplicada

Agora o **AuthContext** define o header em **ambos os axios clients**:

### 1. Importar `api_v1`
```typescript
import { api, api_v1 } from '../services/api';
```

### 2. No `useEffect` (recuperação de sessão)
```typescript
useEffect(() => {
  const storedToken = localStorage.getItem('access_token');
  if (storedToken) {
    setToken(storedToken);
    // Adicionar token aos headers de ambos axios clients
    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    api_v1.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    setUser({ username: 'usuário', id: 0 });
  }
  setIsLoading(false);
}, []);
```

### 3. No `login()`
```typescript
const login = useCallback(async (username: string, password: string) => {
  try {
    const response = await api.post('/token/', { username, password });
    const { access, refresh } = response.data;

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    // Adicionar ao header padrão de ambos axios clients
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    api_v1.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    setToken(access);
    setUser({ username, id: 0 });
  } catch (error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw new Error('Credenciais inválidas');
  }
}, []);
```

### 4. No `logout()`
```typescript
const logout = useCallback(() => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete api.defaults.headers.common['Authorization'];
  delete api_v1.defaults.headers.common['Authorization'];
  setToken(null);
  setUser(null);
}, []);
```

### 5. Backend - Ativar IsAuthenticated
```python
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all().order_by('-id')
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]  # ✅ Agora ativo
```

## 📊 Fluxo Agora

```
1. Usuário faz login
        ↓
2. AuthContext.login() recebe access_token
        ↓
3. Token definido em AMBOS axios clients:
   - api.defaults.headers (para /token/)
   - api_v1.defaults.headers (para /api/v1/movies)
        ↓
4. Frontend tenta GET /api/v1/movies
        ↓
5. api_v1 envia header: Authorization: Bearer {token}
        ↓
6. Django verifica IsAuthenticated
        ↓
7. ✅ Token válido! Retorna lista de filmes
```

## 🧪 Teste

1. **Sem login**: 
   - GET /api/v1/movies → 401 Unauthorized ✅

2. **Com login**:
   - DevTools → Network → GET /api/v1/movies
   - Request Headers: `Authorization: Bearer eyJ0eX...`
   - Response: 200 OK + lista de filmes ✅

## 📍 Arquivos Modificados

- `frontend/movie/src/contexts/AuthContext.tsx` - Adicionar `api_v1` aos headers
- `web2-Ava1/app_core/api/v1/viewsets.py` - Ativar `IsAuthenticated`

## 💡 Lição

Quando você tem **múltiplos axios clients** com baseURLs diferentes:
- Cada um precisa ser configurado **independentemente**
- Se um precisa de autenticação, configure em **ambos** se ambos forem usados
- No nosso caso:
  - `api` → baseURL: `http://localhost:8000` (para /token/)
  - `api_v1` → baseURL: `http://localhost:8000/api/v1/` (para movies, genres, etc)

---

**Status**: ✅ Problema Resolvido e Documentado
**Data**: Novembro de 2025
