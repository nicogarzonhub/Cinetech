import { useQuery } from "@tanstack/react-query";
import { tmdbMoviesRepository } from "@/infrastructure/api/tmdb-movies-repository";

export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ["movies", "search", query],
    queryFn: () => tmdbMoviesRepository.searchMovies(query, new Date()),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
