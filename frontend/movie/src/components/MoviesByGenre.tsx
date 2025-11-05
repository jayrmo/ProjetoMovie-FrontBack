import { useMemo } from 'react';
import MovieCard from './MovieCard';
import { type Movie } from '../types';

interface MoviesByGenreProps {
  movies: Movie[];
  onDelete: (movieId: number) => void;
  onRestore: (movieId: number) => void;
}

export const MoviesByGenre = ({ movies, onDelete, onRestore }: MoviesByGenreProps) => {
  // Agrupar filmes por gênero
  const moviesByGenre = useMemo(() => {
    const grouped: { [key: string]: Movie[] } = {};

    movies.forEach(movie => {
      if (movie.genres && movie.genres.length > 0) {
        movie.genres.forEach(genre => {
          if (!grouped[genre.name]) {
            grouped[genre.name] = [];
          }
          grouped[genre.name].push(movie);
        });
      }
    });

    // Ordenar os gêneros alfabeticamente
    return Object.keys(grouped)
      .sort()
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {} as { [key: string]: Movie[] });
  }, [movies]);

  // Se não houver filmes, mostrar mensagem
  if (movies.length === 0) {
    return <p className="text-gray-400 text-center py-8">Nenhum filme disponível.</p>;
  }

  return (
    <div className="space-y-12">
      {Object.entries(moviesByGenre).map(([genreName, genreMovies]) => (
        <div key={genreName} className="border-b border-gray-700 pb-8 last:border-b-0">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-3xl font-bold text-white">{genreName}</h3>
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {genreMovies.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {genreMovies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onDelete={onDelete}
                onRestore={onRestore}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
