import { Button } from "@/presentation/components/ui/Button";
import {
  MovieCard,
  MovieCardSkeleton,
} from "@/presentation/components/feature/MovieCard";
import { useTrendingMovies } from "@/presentation/hooks/useTrendingMovies";
import { Link } from "react-router";

export function Home() {
  const { data: movies, isPending, isError, refetch } = useTrendingMovies();

  return (
    <main className="min-h-screen bg-surface p-8 text-ink">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-2xl font-semibold">Cinetech</h1>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tendencias de la semana</h2>
        <Link
          to="/explorar"
          className="text-sm font-medium text-brand hover:underline"
        >
          Explorar todo
        </Link>
      </div>

      {isPending && (
        <section
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
          aria-busy="true"
          aria-label="Cargando películas"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </section>
      )}

      {isError && (
        <div
          className="flex flex-col items-start gap-4 rounded-card bg-surface-raised p-6"
          role="alert"
        >
          <p className="text-ink">
            No pudimos cargar las películas. Revisa tu conexión y vuelve a
            intentarlo.
          </p>
          <Button variant="secondary" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {!isPending && !isError && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4 text-ink-muted">
            Ninguna película coincide con estos filtros
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              /* placeholder for clear filters */
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {!isPending && !isError && movies.length > 0 && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </section>
      )}
    </main>
  );
}
