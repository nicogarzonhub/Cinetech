import type { MovieSummary } from "@/domain/movie/movie-summary";

/**
 * Puerto: "algo que trae películas". La aplicación conoce esta forma y
 * nada más — no sabe si detrás hay TMDB, un caché o un doble de prueba.
 * `now` entra como parámetro por la misma razón que en `getReleaseStatus`:
 * determinismo, sin reloj oculto adentro.
 */
export interface MoviesRepository {
  getTrendingThisWeek(now: Date): Promise<MovieSummary[]>;
  searchMovies(query: string, now: Date): Promise<MovieSummary[]>;
}
