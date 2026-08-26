import { useSearchParams } from "react-router";
import { MovieGenreRows } from "@/presentation/components/feature/MovieGenreRows";
import { useTrendingMovies } from "@/presentation/hooks/useTrendingMovies";

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const yearFilter = searchParams.get("year") ?? "";
  const { data: movies, isPending, isError, refetch } = useTrendingMovies();
  const moviesForYear = movies?.filter((movie) => {
    if (!yearFilter || movie.releaseStatus.kind === "unknown") return true;
    return (
      String(movie.releaseStatus.releaseDate.getUTCFullYear()) === yearFilter
    );
  });

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ year: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main className="min-h-screen bg-surface p-8 text-ink">
      <h1 className="mb-6 text-2xl font-semibold">Explorar Películas</h1>

      <div className="mb-6 flex gap-4">
        <select
          className="rounded border border-surface-raised bg-surface-raised px-3 py-2 text-sm"
          value={yearFilter}
          onChange={handleYearChange}
        >
          <option value="">Cualquier año</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3" role="alert">
          <p>No pudimos cargar las categorías de películas.</p>
          <button
            type="button"
            className="rounded-card bg-surface-raised px-4 py-2 font-semibold hover:opacity-90"
            onClick={() => void refetch()}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <MovieGenreRows movies={moviesForYear} isLoading={isPending} />
      )}
    </main>
  );
}
