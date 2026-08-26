import type { MovieSummary } from "@/domain/movie/movie-summary";
import {
  MovieCard,
  MovieCardSkeleton,
} from "@/presentation/components/feature/MovieCard";

const GENRE_ROWS = [
  { id: 28, title: "Acción" },
  { id: 10749, title: "Romance" },
  { id: 35, title: "Comedia" },
  { id: 27, title: "Terror" },
  { id: 878, title: "Ciencia ficción" },
] as const;

const COMPACT_GRID =
  "grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7";

interface MovieGenreRowsProps {
  movies?: MovieSummary[];
  isLoading: boolean;
}

export function MovieGenreRows({ movies, isLoading }: MovieGenreRowsProps) {
  if (isLoading) {
    return (
      <section aria-busy="true" aria-label="Cargando categorías de películas">
        <div className={COMPACT_GRID}>
          {Array.from({ length: 7 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      {GENRE_ROWS.map((genre) => {
        const moviesInGenre =
          movies?.filter((movie) => movie.genreIds?.includes(genre.id)) ?? [];

        if (moviesInGenre.length === 0) return null;

        return (
          <section key={genre.id} aria-labelledby={`genre-${String(genre.id)}`}>
            <h2
              id={`genre-${String(genre.id)}`}
              className="mb-4 text-xl font-semibold"
            >
              {genre.title}
            </h2>
            <div className={COMPACT_GRID}>
              {moviesInGenre.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
