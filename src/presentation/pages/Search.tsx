import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSearchMovies } from "@/presentation/hooks/useSearchMovies";
import { MovieCard } from "@/presentation/components/feature/MovieCard";
import { MovieCardSkeleton } from "@/presentation/components/feature/MovieCardSkeleton";
import { Button } from "@/presentation/components/ui/Button";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const filter = searchParams.get("filter") ?? "all";

  // Estado local para el debounce
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms debounce
    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const {
    data: movies,
    isPending,
    isError,
    refetch,
  } = useSearchMovies(debouncedQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams((prev) => {
      if (value) prev.set("q", value);
      else prev.delete("q");
      return prev;
    });
  };

  const handleFilter = (newFilter: string) => {
    setSearchParams((prev) => {
      if (newFilter === "all") prev.delete("filter");
      else prev.set("filter", newFilter);
      return prev;
    });
  };

  // Filtrado en el cliente basado en la categoría
  const filteredMovies = movies?.filter((movie) => {
    if (filter === "released") return movie.releaseStatus.kind === "released";
    if (filter === "unreleased") return movie.releaseStatus.kind === "upcoming";
    return true;
  });

  const isTyping = query !== debouncedQuery;
  const showSkeletons = (isPending && debouncedQuery.length > 0) || isTyping;

  return (
    <main className="min-h-screen bg-surface p-8 text-ink">
      <h1 className="mb-6 text-2xl font-semibold">Búsqueda</h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Buscar películas por palabras clave..."
          className="w-full max-w-xl rounded border border-surface-raised bg-surface-raised px-4 py-2 text-ink outline-none focus:border-brand"
          value={query}
          onChange={handleSearch}
        />

        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "primary" : "secondary"}
            onClick={() => {
              handleFilter("all");
            }}
          >
            Todas
          </Button>
          <Button
            variant={filter === "released" ? "primary" : "secondary"}
            onClick={() => {
              handleFilter("released");
            }}
          >
            Estrenadas
          </Button>
          <Button
            variant={filter === "unreleased" ? "primary" : "secondary"}
            onClick={() => {
              handleFilter("unreleased");
            }}
          >
            Sin estrenar
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {!query && (
          <p className="text-ink-muted">
            Empieza a escribir para buscar películas en TMDB.
          </p>
        )}

        {showSkeletons && query && (
          <section
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
            role="status"
            aria-label="Buscando películas..."
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </section>
        )}

        {!showSkeletons && isError && (
          <div className="flex flex-wrap items-center gap-3" role="alert">
            <p>No pudimos cargar los resultados de la búsqueda.</p>
            <Button
              variant="secondary"
              onClick={() => {
                void refetch();
              }}
            >
              Reintentar
            </Button>
          </div>
        )}

        {!showSkeletons &&
          !isError &&
          filteredMovies?.length === 0 &&
          query && (
            <div className="flex flex-col items-start gap-4">
              <p className="text-ink-muted">
                Ninguna película coincide con estos filtros o búsqueda.
              </p>
              {filter !== "all" && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleFilter("all");
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}

        {!showSkeletons &&
          !isError &&
          filteredMovies &&
          filteredMovies.length > 0 && (
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </section>
          )}
      </div>
    </main>
  );
}
