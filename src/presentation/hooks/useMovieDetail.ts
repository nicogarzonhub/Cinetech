import { useQuery } from "@tanstack/react-query";
import { tmdbMoviesRepository } from "@/infrastructure/api/tmdb-movies-repository";

export function useMovieDetail(id: number | null) {
  return useQuery({
    queryKey: ["movies", "detail", id],
    queryFn: () => {
      if (id === null) throw new Error("Se requiere el id de una película.");
      return tmdbMoviesRepository.getMovieDetail(id);
    },
    enabled: id !== null,
  });
}
