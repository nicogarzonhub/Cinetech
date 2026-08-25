import { z } from "zod";
import { env } from "@/config/env";
import { getReleaseStatus } from "@/domain/movie/release-status";
import type { MovieSummary } from "@/domain/movie/movie-summary";
import type {
  MovieCompany,
  MovieDetail,
  MoviePerson,
} from "@/domain/movie/movie-detail";
import { ApiError } from "@/domain/shared/api-error";
import type { MoviesRepository } from "@/application/ports/movies-repository";
import { httpClient } from "@/infrastructure/http/http-client";

// Solo los campos que la app realmente lee. TMDB manda muchos más; pedir
// que el resto también cumpla forma sería acoplarse a un contrato que no
// se usa.
const tmdbMovieSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
});

const trendingResponseSchema = z.object({
  results: z.array(tmdbMovieSummarySchema),
});

const tmdbMovieDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string(),
  overview: z.string().nullable(),
  tagline: z.string().nullable(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  runtime: z.number().nullable(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  vote_average: z.number(),
  vote_count: z.number(),
  status: z.string(),
  original_language: z.string(),
  spoken_languages: z.array(
    z.object({ english_name: z.string(), name: z.string() }),
  ),
  production_countries: z.array(z.object({ name: z.string() })),
  production_companies: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      logo_path: z.string().nullable(),
    }),
  ),
  budget: z.number(),
  revenue: z.number(),
  homepage: z.string().nullable(),
  imdb_id: z.string().nullable(),
  credits: z.object({
    cast: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        character: z.string().nullable(),
        profile_path: z.string().nullable(),
        order: z.number(),
      }),
    ),
    crew: z.array(z.object({ name: z.string(), job: z.string() })),
  }),
  videos: z.object({
    results: z.array(
      z.object({
        key: z.string(),
        site: z.string(),
        type: z.string(),
        official: z.boolean(),
      }),
    ),
  }),
});

// Tamaño pequeño a propósito: esta forma alimenta una cuadrícula, no una
// ficha a pantalla completa.
const POSTER_SIZE = "w342";
const DETAIL_POSTER_SIZE = "w500";
const BACKDROP_SIZE = "w1280";
const PROFILE_SIZE = "w185";

function buildPosterUrl(posterPath: string | null): string | null {
  return posterPath
    ? `${env.VITE_TMDB_IMAGE_BASE}/${POSTER_SIZE}${posterPath}`
    : null;
}

function buildImageUrl(path: string | null, size: string): string | null {
  return path ? `${env.VITE_TMDB_IMAGE_BASE}/${size}${path}` : null;
}

function toMovieSummary(
  raw: z.infer<typeof tmdbMovieSummarySchema>,
  now: Date,
): MovieSummary {
  return {
    id: raw.id,
    title: raw.title,
    posterUrl: buildPosterUrl(raw.poster_path),
    releaseStatus: getReleaseStatus(raw.release_date, now),
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
  };
}

function toMovieDetail(
  raw: z.infer<typeof tmdbMovieDetailSchema>,
): MovieDetail {
  const cast: MoviePerson[] = raw.credits.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 12)
    .map((person) => ({
      id: person.id,
      name: person.name,
      character: person.character,
      profileUrl: buildImageUrl(person.profile_path, PROFILE_SIZE),
    }));
  const productionCompanies: MovieCompany[] = raw.production_companies.map(
    (company) => ({
      id: company.id,
      name: company.name,
      logoUrl: buildImageUrl(company.logo_path, PROFILE_SIZE),
    }),
  );
  const trailer =
    raw.videos.results.find(
      (video) =>
        video.site === "YouTube" && video.type === "Trailer" && video.official,
    ) ??
    raw.videos.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    );
  return {
    id: raw.id,
    title: raw.title,
    originalTitle: raw.original_title,
    overview: raw.overview,
    tagline: raw.tagline,
    posterUrl: buildImageUrl(raw.poster_path, DETAIL_POSTER_SIZE),
    backdropUrl: buildImageUrl(raw.backdrop_path, BACKDROP_SIZE),
    releaseDate: raw.release_date || null,
    runtime: raw.runtime,
    genres: raw.genres.map((genre) => genre.name),
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    status: raw.status,
    originalLanguage: raw.original_language,
    spokenLanguages: raw.spoken_languages.map(
      (language) => language.name || language.english_name,
    ),
    productionCountries: raw.production_countries.map(
      (country) => country.name,
    ),
    productionCompanies,
    budget: raw.budget,
    revenue: raw.revenue,
    homepage: raw.homepage,
    imdbId: raw.imdb_id,
    director:
      raw.credits.crew.find((person) => person.job === "Director")?.name ??
      null,
    cast,
    trailerUrl: trailer
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : null,
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
    const { data } = await httpClient.get<unknown>("/trending/movie/week");

    const parsed = trendingResponseSchema.safeParse(data);
    if (!parsed.success) {
      throw new ApiError(
        "unknown",
        "La respuesta de TMDB no tiene el formato esperado.",
      );
    }

    return parsed.data.results.map((movie) => toMovieSummary(movie, now));
  },

  async searchMovies(query: string, now: Date): Promise<MovieSummary[]> {
    if (!query) return [];
    const { data } = await httpClient.get<unknown>("/search/movie", {
      params: { query, language: "es-MX" },
    });

    const parsed = trendingResponseSchema.safeParse(data);
    if (!parsed.success) {
      throw new ApiError(
        "unknown",
        "La respuesta de TMDB no tiene el formato esperado.",
      );
    }

    return parsed.data.results.map((movie) => toMovieSummary(movie, now));
  },

  async getMovieDetail(id: number): Promise<MovieDetail> {
    const { data } = await httpClient.get<unknown>(`/movie/${String(id)}`, {
      params: { language: "es-MX", append_to_response: "credits,videos" },
    });
    const parsed = tmdbMovieDetailSchema.safeParse(data);
    if (!parsed.success)
      throw new ApiError(
        "unknown",
        "La respuesta de TMDB no tiene el formato esperado.",
      );
    return toMovieDetail(parsed.data);
  },
};
