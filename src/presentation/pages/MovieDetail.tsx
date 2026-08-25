import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  Star,
} from "lucide-react";
import { Link, useParams } from "react-router";
import type { MovieDetail as MovieDetailData } from "@/domain/movie/movie-detail";
import { Button } from "@/presentation/components/ui/Button";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { useMovieDetail } from "@/presentation/hooks/useMovieDetail";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeZone: "UTC",
});
const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatDate(date: string | null) {
  return date
    ? dateFormatter.format(new Date(`${date}T00:00:00Z`))
    : "Sin fecha disponible";
}

function formatRuntime(minutes: number | null) {
  if (!minutes) return "Duración no disponible";
  return `${String(Math.floor(minutes / 60))} h ${String(minutes % 60)} min`;
}

function DetailSkeleton() {
  return (
    <main
      className="min-h-screen bg-surface p-4 text-ink sm:p-8"
      aria-busy="true"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-72 w-full sm:h-96" />
        <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
          <Skeleton className="aspect-poster w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailsList({ movie }: { movie: MovieDetailData }) {
  const rows = [
    ["Estado", movie.status],
    ["Idioma original", movie.originalLanguage.toUpperCase()],
    ["Idiomas", movie.spokenLanguages.join(", ")],
    ["Países", movie.productionCountries.join(", ")],
    [
      "Presupuesto",
      movie.budget ? currencyFormatter.format(movie.budget) : "No disponible",
    ],
    [
      "Recaudo",
      movie.revenue ? currencyFormatter.format(movie.revenue) : "No disponible",
    ],
  ].filter(([, value]) => value);
  return (
    <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-sm text-ink-muted">{label}</dt>
          <dd className="mt-0.5 font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function MovieDetail() {
  const { id } = useParams();
  const movieId = id && /^\d+$/.test(id) ? Number(id) : null;
  const { data: movie, isPending, isError, refetch } = useMovieDetail(movieId);

  if (isPending) return <DetailSkeleton />;
  if (!movieId || isError)
    return (
      <main className="min-h-screen bg-surface p-8 text-ink">
        <div
          className="mx-auto flex max-w-xl flex-col items-start gap-4 rounded-card bg-surface-raised p-6"
          role="alert"
        >
          <h1 className="text-xl font-semibold">
            No pudimos cargar esta película
          </h1>
          <p className="text-ink-muted">
            Puede que el enlace no sea válido o que la película ya no esté
            disponible.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/">
              <Button variant="secondary">Volver al inicio</Button>
            </Link>
            {movieId && (
              <Button variant="primary" onClick={() => void refetch()}>
                Reintentar
              </Button>
            )}
          </div>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-surface pb-12 text-ink">
      <div className="relative isolate overflow-hidden border-b border-surface-raised">
        {movie.backdropUrl && (
          <img
            src={movie.backdropUrl}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-surface via-surface/85 to-surface/45" />
        <div className="mx-auto max-w-6xl p-4 pt-6 sm:p-8 sm:pt-10">
          <Link
            to="/explorar"
            className="inline-flex items-center gap-2 rounded-card px-2 py-1 text-sm font-medium hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a películas
          </Link>
          <div className="mt-10 grid gap-7 md:grid-cols-[minmax(13rem,18rem)_1fr] md:items-end">
            <div className="aspect-poster overflow-hidden rounded-card bg-surface-raised shadow-2xl">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={`Póster de ${movie.title}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-ink-muted">
                  Póster no disponible
                </div>
              )}
            </div>
            <div className="pb-2">
              {movie.originalTitle !== movie.title && (
                <p className="text-sm text-ink-muted">{movie.originalTitle}</p>
              )}
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-5xl">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="mt-3 text-lg italic text-ink-muted">
                  “{movie.tagline}”
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-brand" />
                  {formatDate(movie.releaseDate)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-brand" />
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-current text-status-unreleased" />
                  {movie.voteAverage.toFixed(1)}{" "}
                  <span className="text-ink-muted">
                    ({movie.voteCount.toLocaleString("es-CO")} votos)
                  </span>
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-surface-raised/85 px-3 py-1 text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {movie.trailerUrl && (
                  <a href={movie.trailerUrl} target="_blank" rel="noreferrer">
                    <Button variant="primary">
                      Ver tráiler <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                {movie.homepage && (
                  <a href={movie.homepage} target="_blank" rel="noreferrer">
                    <Button variant="secondary">
                      Sitio oficial <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 p-4 sm:p-8 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold">Sinopsis</h2>
            <p className="mt-3 max-w-3xl leading-7 text-ink-muted">
              {movie.overview ??
                "TMDB no tiene una sinopsis disponible para esta película."}
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Reparto</h2>
            {movie.cast.length ? (
              <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {movie.cast.map((person) => (
                  <li
                    key={person.id}
                    className="overflow-hidden rounded-card bg-surface-raised"
                  >
                    <div className="aspect-square bg-surface">
                      {person.profileUrl ? (
                        <img
                          src={person.profileUrl}
                          alt={person.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-3 text-center text-sm text-ink-muted">
                          Sin foto
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-medium">{person.name}</p>
                      {person.character && (
                        <p className="mt-1 text-sm text-ink-muted">
                          {person.character}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-ink-muted">
                No hay información de reparto disponible.
              </p>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-semibold">Información adicional</h2>
            <div className="mt-4 rounded-card bg-surface-raised p-5">
              <DetailsList movie={movie} />
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-card bg-surface-raised p-5">
            <h2 className="font-semibold">Equipo</h2>
            <dl className="mt-3">
              <dt className="text-sm text-ink-muted">Dirección</dt>
              <dd className="mt-1 font-medium">
                {movie.director ?? "No disponible"}
              </dd>
            </dl>
          </section>
          <section className="rounded-card bg-surface-raised p-5">
            <h2 className="font-semibold">Productoras</h2>
            {movie.productionCompanies.length ? (
              <ul className="mt-3 space-y-3">
                {movie.productionCompanies.map((company) => (
                  <li key={company.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-12 shrink-0 items-center justify-center rounded bg-surface p-1">
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-ink-muted">Logo</span>
                      )}
                    </div>
                    <span className="text-sm">{company.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">No disponible</p>
            )}
          </section>
          {movie.imdbId && (
            <a
              className="inline-flex text-sm font-medium text-brand hover:underline"
              href={`https://www.imdb.com/title/${movie.imdbId}/`}
              target="_blank"
              rel="noreferrer"
            >
              Ver ficha en IMDb <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          )}
        </aside>
      </div>
    </main>
  );
}
