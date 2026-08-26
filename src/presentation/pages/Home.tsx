import { useState } from "react";
import { Button } from "@/presentation/components/ui/Button";
import {
  MovieCard,
  MovieCardSkeleton,
} from "@/presentation/components/feature/MovieCard";
import { useTrendingMovies } from "@/presentation/hooks/useTrendingMovies";
import { Link } from "react-router";

export function Home() {
  const { data: movies, isPending, isError, refetch } = useTrendingMovies();
  const [filter, setFilter] = useState<
    "trending" | "released" | "upcoming" | "top-rated"
  >("trending");

  const visibleMovies = (() => {
    if (!movies) return [];
    if (filter === "released")
      return movies.filter((movie) => movie.releaseStatus.kind === "released");
    if (filter === "upcoming")
      return movies.filter((movie) => movie.releaseStatus.kind === "upcoming");
    if (filter === "top-rated")
      return [...movies].sort((a, b) => b.voteAverage - a.voteAverage);
    return movies;
  })();

  const filterLabel = {
    trending: "Tendencias de la semana",
    released: "Películas estrenadas",
    upcoming: "Próximos estrenos",
    "top-rated": "Mejor valoradas",
  }[filter];

  return (
    <main className="min-h-screen bg-surface p-8 text-ink">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-2xl font-semibold">Cinetech</h1>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{filterLabel}</h2>
        <Link
          to="/explorar"
          className="text-sm font-medium text-brand hover:underline"
        >
          Explorar todo
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" aria-label="Filtrar películas">
        {[
          ["trending", "Tendencias"],
          ["released", "Estrenadas"],
          ["upcoming", "Por estrenar"],
          ["top-rated", "Mejor valoradas"],
        ].map(([value, label]) => (
          <Button
            key={value}
            variant={filter === value ? "primary" : "secondary"}
            onClick={() => {
              setFilter(value as typeof filter);
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      {isPending && (
        <section
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
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

      {!isPending && !isError && visibleMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4 text-ink-muted">
            No hay películas disponibles para este filtro
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

      {!isPending && !isError && visibleMovies.length > 0 && (
        <section className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {visibleMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </section>
      )}
    </main>
  );
}
