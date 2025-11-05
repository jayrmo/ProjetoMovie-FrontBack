import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type MovieCardProps } from '../types';
import { api_v1 } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

interface MovieCardExtendedProps extends MovieCardProps {
  onDelete?: (movieId: number) => void;
  onRestore?: (movieId: number) => void;
}

const MovieCard = ({ movie, onDelete, onRestore }: MovieCardExtendedProps) => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Função para extrair o ID do vídeo de uma URL do YouTube
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    
    // Tenta encontrar o ID do vídeo em diferentes formatos de URL do YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = movie.url ? getYouTubeVideoId(movie.url) : null;

  // Função para abrir o vídeo no YouTube quando clicar no card
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.favorite-btn') || (e.target as HTMLElement).closest('.action-btn')) {
      return;
    }
    
    if (movie.url) {
      window.open(movie.url, '_blank');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/movies/${movie.id}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await api_v1.delete(`/movies/${movie.id}/`);
      setShowDeleteConfirm(false);
      addNotification(`Filme "${movie.title}" deletado com sucesso`, 'success');
      // Atualizar a UI localmente sem recarregar
      onDelete?.(movie.id);
    } catch (err) {
      console.error('Erro ao deletar filme:', err);
      addNotification(`Erro ao deletar filme "${movie.title}"`, 'error');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsRestoring(true);
      await api_v1.patch(`/movies/${movie.id}/`, { is_deleted: false });
      addNotification(`Filme "${movie.title}" restaurado com sucesso`, 'success');
      onRestore?.(movie.id);
    } catch (err) {
      console.error('Erro ao restaurar filme:', err);
      addNotification(`Erro ao restaurar filme "${movie.title}"`, 'error');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <>
      <div 
        className={`rounded-lg overflow-hidden shadow-lg transition-all transform cursor-pointer relative ${
          movie.is_deleted 
            ? 'bg-gray-700 opacity-50 hover:opacity-60' 
            : 'bg-gray-800 hover:scale-105 hover:shadow-2xl'
        }`}
        onClick={handleClick}
        title={videoId ? "Clique para assistir no YouTube" : "Trailer não disponível"}
      >
        
        <div className="w-full h-64 bg-gray-700 flex items-center justify-center overflow-hidden relative">
          {videoId ? (
            <iframe
              className={`w-full h-full ${movie.is_deleted ? 'opacity-30' : ''}`}
              src={`https://www.youtube.com/embed/${videoId}`}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <span className="text-gray-500">Sem trailer disponível</span>
          )}
          
          {movie.is_deleted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-red-400 font-bold text-lg">DELETADO</span>
            </div>
          )}
        </div>
        
        {/* Conteúdo do Card */}
        <div className={`p-6 ${movie.is_deleted ? 'opacity-60' : ''}`}>
          <h3 className="text-lg font-bold line-clamp-2 min-h-[3.5rem]">{movie.title}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(movie.release_date).getFullYear()}
          </p>
          
          {/* Diretor e Atores */}
          <div className="mt-3 text-sm text-gray-400">
            <p className="truncate"><span className="text-gray-300">Diretor:</span> {movie.director.name}</p>
            <p className="truncate"><span className="text-gray-300">Elenco:</span> {movie.actors.map(actor => actor.name).join(', ')}</p>
          </div>

          {/* Gêneros */}
          <div className="mt-3 flex flex-wrap gap-2">
            {movie.genres.map(genre => (
              <span key={genre.id} className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {genre.name}
              </span>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="mt-4 flex gap-2 action-btn">
            {movie.is_deleted ? (
              <button
                onClick={handleRestore}
                disabled={isRestoring}
                className={`flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded text-xs font-semibold transition-colors ${
                  movie.is_deleted ? 'opacity-100' : ''
                }`}
              >
                ↻ Restaurar
              </button>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded text-xs font-semibold transition-colors"
                >
                  ✎ Editar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  🗑 Deletar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Confirmar exclusão</h2>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja deletar o filme <strong>{movie.title}</strong>? O filme poderá ser restaurado.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;