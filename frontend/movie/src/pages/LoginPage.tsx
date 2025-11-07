import { useState, type FormEvent } from 'react';
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
      addNotification(`Bem-vindo, ${username}!`, 'success');
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
              <label className="block text-white mb-2 font-semibold">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-red-600 focus:outline-none transition-colors"
                placeholder="Digite seu usuário"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-semibold">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-red-600 focus:outline-none transition-colors"
                placeholder="Digite sua senha"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Fazendo Login...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
