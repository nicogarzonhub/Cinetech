import type { MovieSummary, ReleaseStatus } from "@/domain/movie/movie-summary";
import { Badge, type BadgeTone } from "@/presentation/components/ui/Badge";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { movieCardCopy } from "@/presentation/copy/movieCard";

export type MovieCardProps = {
  movie: MovieSummary;
};

const TONE_BY_STATUS: Record<ReleaseStatus["kind"], BadgeTone> = {
  released: "released",
  upcoming: "unreleased",
  unknown: "unknown",
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeZone: "UTC",
});

function statusWord(status: ReleaseStatus): string {
  switch (status.kind) {
    case "released":
      return movieCardCopy.statusReleased;
    case "upcoming":
      return movieCardCopy.statusUpcoming;
    case "unknown":
      return movieCardCopy.statusUnknown;
  }
}

function releaseSentence(status: ReleaseStatus): string {
  switch (status.kind) {
    case "released":
      return movieCardCopy.releasedOn(dateFormatter.format(status.releaseDate));
    case "upcoming":
      return movieCardCopy.releasesOn(dateFormatter.format(status.releaseDate));
    case "unknown":
      return movieCardCopy.dateUnknown;
  }
}

export function MovieCard({ movie }: MovieCardProps) {
  const tone = TONE_BY_STATUS[movie.releaseStatus.kind];
  const year =
    movie.releaseStatus.kind !== "unknown"
      ? movie.releaseStatus.releaseDate.getFullYear()
      : "";

  return (
    <a
      href={`/pelicula/${String(movie.id)}`}
      className="flex flex-col overflow-hidden rounded-card bg-surface-raised text-ink transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div className="aspect-poster w-full overflow-hidden bg-surface">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt=""
            loading="lazy"
            width={342}
            height={513}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-ink-muted">
            {movieCardCopy.posterFallback}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold">{movie.title}</h3>

        <div className="flex items-center gap-2 text-xs text-ink-muted">
          {year && <span>{year}</span>}
          {/* Aquí iría la duración si la tuviéramos del endpoint de TMDB */}
        </div>

        <div className="mt-auto flex flex-col items-start gap-2">
          {movie.voteCount > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">
                {movie.voteAverage.toFixed(1)}
              </span>
              <span className="text-xs text-ink-muted">
                ({movie.voteCount} {movie.voteCount === 1 ? "voto" : "votos"})
              </span>
            </div>
          )}
          <Badge tone={tone}>{statusWord(movie.releaseStatus)}</Badge>
        </div>
      </div>
    </a>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card bg-surface-raised transition-opacity">
      <div className="aspect-poster w-full overflow-hidden bg-surface">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />

        <div className="mt-auto flex flex-col items-start gap-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
