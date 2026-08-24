import { useQuery } from '@tanstack/react-query';
import { tmdbMoviesRepository } from '@/infrastructure/api/tmdb-movies-repository';

/**
 * Tendencias de la semana, para la portada. Clave jerárquica
 * (`['movies', 'trending', 'week']`) para poder invalidar por prefijo el
 * día que haya más de un tipo de "tendencias".
 */
export function useTrendingMovies() {
  return useQuery({
    queryKey: ['movies', 'trending', 'week'],
    queryFn: () => tmdbMoviesRepository.getTrendingThisWeek(new Date()),
  });
}
