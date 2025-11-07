# 🔐 SETUP DE AUTENTICAÇÃO - LOGIN IMPLEMENTADO

## ✅ O QUE FOI IMPLEMENTADO

✅ **AuthContext.tsx** - Contexto global de autenticação
✅ **LoginPage.tsx** - Página de login com formulário
✅ **ProtectedRoute.tsx** - Componente para rotas protegidas
✅ **NavBar.tsx** - Barra de navegação com botão de logout
✅ **App.tsx** - Integração com AuthProvider e rotas protegidas

---

## 📋 PRÓXIMOS PASSOS

### 1️⃣ Configurar CORS no Backend

Editar `web2-Ava1/moviematch/settings.py`:

```python
# Adicionar no final do arquivo
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

### 2️⃣ Verificar Instalação do django-cors-headers

```bash
pip list | grep cors
```

Se não tiver instalado:
```bash
pip install django-cors-headers
```

Adicionar em `settings.py`:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Deve ser primeiro!
    'django.middleware.common.CommonMiddleware',
    ...
]
```

### 3️⃣ Criar Usuário de Teste

No terminal do backend:
```bash
python manage.py createsuperuser
```

Ou usar este script para criar automaticamente:

```bash
python manage.py shell
```

Depois cole:
```python
from django.contrib.auth.models import User
User.objects.create_user(username='admin', password='admin123')
exit()
```

---

## 🚀 TESTAR O LOGIN

### 1. Certificar que o Backend está Rodando
```bash
cd web2-Ava1
python manage.py runserver
# http://localhost:8000 ✅
```

### 2. Certificar que o Frontend está Rodando
```bash
cd frontend/movie
npm run dev
# http://localhost:5173 ✅
```

### 3. Acessar o Frontend
Abrir: `http://localhost:5173`

**Deve aparecer**: Página de login com formulário

### 4. Fazer Login
- **Usuário**: `admin`
- **Senha**: `admin123`

**Depois de clicar "Entrar"**:
- ✅ Notificação de sucesso
- ✅ Redireciona para homepage
- ✅ NavBar mostra "Bem-vindo, admin"
- ✅ Botão "Sair" aparece na navbar

### 5. Testar Logout
- Clicar botão "Sair"
- ✅ Redireciona para login
- ✅ Token removido

---

## 🔍 VERIFICAR NO DEVTOOLS

### Network Tab
1. Abrir DevTools (F12)
2. Ir para "Network"
3. Fazer login
4. Procurar por requisição `/token/`
5. Ver resposta com `access` e `refresh` tokens

### Application Tab
1. Ir para "Application"
2. LocalStorage
3. Ver `access_token` e `refresh_token` salvos

---

## ⚠️ POSSÍVEIS ERROS

### Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solução**: 
1. Instalar `django-cors-headers`
2. Adicionar ao `INSTALLED_APPS`
3. Adicionar ao `MIDDLEWARE` (primeiro!)
4. Configurar `CORS_ALLOWED_ORIGINS`

### Erro: "Invalid credentials" ao fazer login
**Solução**:
1. Verificar se usuário existe: `python manage.py shell`
   ```python
   from django.contrib.auth.models import User
   User.objects.filter(username='admin').exists()
   ```
2. Se não existe, criar: `python manage.py createsuperuser`

### Erro: "Cannot POST /token/"
**Solução**:
1. Verificar se URL está correta em `AuthContext.tsx`
2. Deve ser: `/token/`
3. Backend deve ter endpoint em `urls.py`

### Erro: "Token não aparece em LocalStorage"
**Solução**:
1. Verificar resposta da API no Network tab
2. Deve ter campos: `access` e `refresh`
3. Se não tiver, backend não está retornando tokens corretamente

---

## 🎯 FLUXO DE AUTENTICAÇÃO

```
1. Usuário vai para http://localhost:5173
   ↓
2. ProtectedRoute verifica se tem token
   - SIM → Mostra homepage
   - NÃO → Redireciona para /login
   ↓
3. LoginPage carrega
   ↓
4. Usuário preenche username e password
   ↓
5. Clicar "Entrar"
   ↓
6. AuthContext.login() faz POST para /token/
   ↓
7. Recebe access e refresh tokens
   ↓
8. Salva em localStorage
   ↓
9. Adiciona ao header: Authorization: Bearer {token}
   ↓
10. Redireciona para homepage
   ↓
11. NavBar aparece com nome do usuário e botão "Sair"
   ↓
12. Usuário clica "Sair"
   ↓
13. Logout remove tokens
   ↓
14. Redireciona para /login
```

---

## 📱 ESTRUTURA DE AUTENTICAÇÃO

### AuthContext.tsx
- `user` - Dados do usuário logado
- `token` - Token JWT
- `isAuthenticated` - Boolean se está logado
- `isLoading` - Carregando sessão anterior
- `login(username, password)` - Fazer login
- `logout()` - Fazer logout

### ProtectedRoute.tsx
- Verifica se `isAuthenticated` é true
- Se sim: renderiza `children`
- Se não: redireciona para `/login`
- Se está carregando: mostra spinner

### LoginPage.tsx
- Formulário com username e password
- Chama `login()` do context
- Notificações de sucesso/erro
- Redireciona para home após sucesso

### NavBar.tsx
- Mostra nome do usuário
- Botão "Sair" para fazer logout
- Redireciona para login após logout

---

## ✅ CHECKLIST FINAL

- [ ] Backend rodando em http://localhost:8000
- [ ] Frontend rodando em http://localhost:5173
- [ ] Usuário `admin` com senha `admin123` criado
- [ ] django-cors-headers instalado
- [ ] CORS configurado em settings.py
- [ ] Acessar frontend e aparecer página de login
- [ ] Fazer login com admin/admin123
- [ ] Aparecer homepage com NavBar
- [ ] NavBar mostra "Bem-vindo, admin"
- [ ] Botão "Sair" funciona
- [ ] Redireciona para login após logout
- [ ] Token aparece em LocalStorage

---

**Status**: ✅ LOGIN IMPLEMENTADO E PRONTO
