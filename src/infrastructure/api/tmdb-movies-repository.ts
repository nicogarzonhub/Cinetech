import { z } from 'zod';
import { env } from '@/config/env';
import { getReleaseStatus } from '@/domain/movie/release-status';
import type { MovieSummary } from '@/domain/movie/movie-summary';
import { ApiError } from '@/domain/shared/api-error';
import type { MoviesRepository } from '@/application/ports/movies-repository';
import { httpClient } from '@/infrastructure/http/http-client';

// Solo los campos que la app realmente lee. TMDB manda muchos más; pedir
// que el resto también cumpla forma sería acoplarse a un contrato que no
// se usa.
const tmdbMovieSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
});

const trendingResponseSchema = z.object({
  results: z.array(tmdbMovieSummarySchema),
});

// Tamaño pequeño a propósito: esta forma alimenta una cuadrícula, no una
// ficha a pantalla completa.
const POSTER_SIZE = 'w342';

function buildPosterUrl(posterPath: string | null): string | null {
  return posterPath ? `${env.VITE_TMDB_IMAGE_BASE}/${POSTER_SIZE}${posterPath}` : null;
}

function toMovieSummary(raw: z.infer<typeof tmdbMovieSummarySchema>, now: Date): MovieSummary {
  return {
    id: raw.id,
    title: raw.title,
    posterUrl: buildPosterUrl(raw.poster_path),
    releaseStatus: getReleaseStatus(raw.release_date, now),
  };
}

/**
 * Implementación de `MoviesRepository` contra TMDB. Nada de `as MovieSummary[]`
 * sobre lo que llega: si la forma cambia, `safeParse` lo atrapa aquí y sale
 * como un `ApiError` legible, no como un `undefined.map is not a function`
 * tres componentes más allá.
 */
export const tmdbMoviesRepository: MoviesRepository = {
  async getTrendingThisWeek(now: Date): Promise<MovieSummary[]> {
    const { data } = await httpClient.get<unknown>('/trending/movie/week');

    const parsed = trendingResponseSchema.safeParse(data);
    if (!parsed.success) {
      throw new ApiError('unknown', 'La respuesta de TMDB no tiene el formato esperado.');
    }

    return parsed.data.results.map((movie) => toMovieSummary(movie, now));
  },
};
