import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api_v1 } from '../services/api';
import { type MovieFormData, type Director, type Actor, type Genre } from '../types';
import { useNotification } from '../contexts/NotificationContext';

export function EditMoviePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  
  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    release_date: '',
    synopsis: '',
    url: '',
    director_id: '',
    actor_ids: [],
    genre_ids: [],
  });

  const [directors, setDirectors] = useState<Director[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Carrega o filme e os dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingInitial(true);
        const [movieRes, directorsRes, actorsRes, genresRes] = await Promise.all([
          api_v1.get(`/movies/${id}/`),
          api_v1.get('/directors/'),
          api_v1.get('/actors/'),
          api_v1.get('/genres/'),
        ]);

        const movie = movieRes.data;
        setFormData({
          title: movie.title,
          release_date: movie.release_date,
          synopsis: movie.synopsis,
          url: movie.url || '',
          director_id: String(movie.director.id),
          actor_ids: movie.actors.map((a: Actor) => String(a.id)),
          genre_ids: movie.genres.map((g: Genre) => String(g.id)),
        });

        setDirectors(directorsRes.data.results || directorsRes.data);
        setActors(actorsRes.data.results || actorsRes.data);
        setGenres(genresRes.data.results || genresRes.data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar o filme');
      } finally {
        setIsLoadingInitial(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>, field: 'actor_ids' | 'genre_ids') => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      [field]: selected,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const submitData = {
        title: formData.title,
        release_date: formData.release_date,
        synopsis: formData.synopsis,
        url: formData.url,
        director_id: parseInt(formData.director_id),
        actor_ids: formData.actor_ids.map(id => parseInt(id)),
        genre_ids: formData.genre_ids.map(id => parseInt(id)),
      };

      await api_v1.put(`/movies/${id}/`, submitData);
      addNotification(`Filme "${submitData.title}" atualizado com sucesso!`, 'success');
      navigate('/');
    } catch (err: any) {
      console.error('Erro ao atualizar filme:', err);
      const errorMsg = err.response?.data?.detail || 'Erro ao atualizar o filme';
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="bg-gray-900 min-h-screen w-full py-8 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen w-full py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-400 mb-4"
          >
            ← Voltar
          </button>
          <h1 className="text-4xl font-bold text-red-600">Editar Filme</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
          {error && (
            <div className="bg-red-500 text-white p-4 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-white mb-2">
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="release_date" className="block text-white mb-2">
              Data de Lançamento *
            </label>
            <input
              type="date"
              id="release_date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="synopsis" className="block text-white mb-2">
              Sinopse *
            </label>
            <textarea
              id="synopsis"
              name="synopsis"
              value={formData.synopsis}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-white mb-2">
              URL do Trailer (YouTube)
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="director_id" className="block text-white mb-2">
              Diretor *
            </label>
            <select
              id="director_id"
              name="director_id"
              value={formData.director_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um diretor</option>
              {directors.map(director => (
                <option key={director.id} value={director.id}>
                  {director.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="actor_ids" className="block text-white mb-2">
              Atores (Segure Ctrl/Cmd para selecionar múltiplos)
            </label>
            <select
              id="actor_ids"
              multiple
              value={formData.actor_ids}
              onChange={(e) => handleMultiSelect(e, 'actor_ids')}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {actors.map(actor => (
                <option key={actor.id} value={actor.id}>
                  {actor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="genre_ids" className="block text-white mb-2">
              Gêneros (Segure Ctrl/Cmd para selecionar múltiplos) *
            </label>
            <select
              id="genre_ids"
              multiple
              value={formData.genre_ids}
              onChange={(e) => handleMultiSelect(e, 'genre_ids')}
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isLoading ? 'Salvando...' : 'Atualizar Filme'}
          </button>
        </form>
      </div>
    </div>
  );
}