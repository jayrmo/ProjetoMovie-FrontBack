import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './components/MovieCard';
import { MoviesByGenre } from './components/MoviesByGenre';
import { NavBar } from './components/NavBar';
import { NotificationPanel } from './components/NotificationPanel';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { type Movie } from './types';
import { api_v1 } from './services/api';
import { ManageMoviesPage } from './pages/ManageMoviesPage';
import { EditMoviePage } from './pages/EditMoviePage';
import { LoginPage } from './pages/LoginPage';


const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api_v1.get('/movies/');
      const data = response.data;
      setMovies(data.results || data);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleMovieDelete = useCallback((movieId: number) => {
    setMovies(prevMovies =>
      prevMovies.map(movie =>
        movie.id === movieId ? { ...movie, is_deleted: true } : movie
      )
    );
  }, []);

  const handleMovieRestore = useCallback((movieId: number) => {
    setMovies(prevMovies =>
      prevMovies.map(movie =>
        movie.id === movieId ? { ...movie, is_deleted: false } : movie
      )
    );
  }, []);

  const activeMovies = movies.filter(movie => !movie.is_deleted);
  const deletedMovies = movies.filter(movie => movie.is_deleted);

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-white text-lg font-semibold">Carregando filmes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="bg-gray-900 min-h-screen w-full py-8">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex justify-end">
            <button
              onClick={() => navigate('/manage')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              + Adicionar Filmes
            </button>
          </div>
        
        {/* Seção de Filmes Ativos por Gênero */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Filmes por Categoria</h2>
          <MoviesByGenre 
            movies={activeMovies}
            onDelete={handleMovieDelete}
            onRestore={handleMovieRestore}
          />
        </div>

        {/* Seção de Filmes Deletados */}
        {deletedMovies.length > 0 && (
          <div className="border-t border-gray-700 pt-12">
            <h2 className="text-2xl font-bold text-gray-400 mb-6">Filmes Deletados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {deletedMovies.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie}
                  onDelete={handleMovieDelete}
                  onRestore={handleMovieRestore}
                />
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};



const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <NotificationPanel />
          <Routes>
            {/* Rota pública - Login */}
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

            {/* Rota padrão - redireciona para home ou login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;