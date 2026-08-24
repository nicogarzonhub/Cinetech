import { Button } from '@/presentation/components/ui/Button';
import { Badge } from '@/presentation/components/ui/Badge';
import { Header } from '@/presentation/components/feature/Header';
import { MovieCard } from '@/presentation/components/feature/MovieCard';
import { useTrendingMovies } from '@/presentation/hooks/useTrendingMovies';

// Esto es solo para ver los componentes en pantalla mientras aprendemos.
// Más adelante esto se reemplaza por las rutas reales (Inicio, Explorar...).
function App() {
  const { data: movies, isPending, isError, refetch } = useTrendingMovies();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-surface p-8 text-ink">
        <h1 className="mb-6 text-2xl font-semibold">Cinetech</h1>

        <h2 className="mb-4 text-lg font-semibold">Tendencias de la semana (TMDB)</h2>

        {isPending && (
          <p className="text-ink-muted" role="status">
            Cargando películas…
          </p>
        )}

        {isError && (
          <div className="flex flex-wrap items-center gap-3" role="alert">
            <p>No pudimos cargar las películas.</p>
            <Button variant="secondary" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </div>
        )}

        {movies && movies.length === 0 && <p className="text-ink-muted">No hay películas en tendencia.</p>}

        {movies && movies.length > 0 && (
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default App;
