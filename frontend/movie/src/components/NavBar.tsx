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
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-red-600 text-2xl font-bold cursor-pointer hover:text-red-500 transition-colors"
            onClick={() => navigate('/')}>
          MovieMatch
        </h1>
        
        <div className="flex items-center gap-6">
          {user && (
            <span className="text-gray-300">
              Bem-vindo, <span className="text-white font-semibold">{user.username}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
