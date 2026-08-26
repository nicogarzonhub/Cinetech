import type { MovieSummary, ReleaseStatus } from "@/domain/movie/movie-summary";
import { Badge, type BadgeTone } from "@/presentation/components/ui/Badge";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { movieCardCopy } from "@/presentation/copy/movieCard";
import { useCineteca } from "@/presentation/providers/CinetecaProvider";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router";

export interface MovieCardProps {
  movie: MovieSummary;
}

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
  const { isMovieSaved, saveMovie, removeMovie } = useCineteca();
  const saved = isMovieSaved(movie.id);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (saved) {
      removeMovie(movie.id);
    } else {
      saveMovie(movie);
    }
  };

  return (
    <div className="group relative">
      <Link
        to={`/pelicula/${String(movie.id)}`}
        className="flex h-full flex-col overflow-hidden rounded-card bg-surface-raised text-ink transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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

        <div className="flex flex-1 flex-col gap-1.5 p-2.5">
          <h3 className="line-clamp-2 pr-7 text-xs font-semibold sm:text-sm">
            {movie.title}
          </h3>

          <div className="mt-auto flex flex-col items-start gap-1">
            <Badge tone={tone}>{statusWord(movie.releaseStatus)}</Badge>
            <p className="text-[0.6875rem] text-ink-muted sm:text-xs">
              {releaseSentence(movie.releaseStatus)}
            </p>
          </div>
        </div>
      </Link>

      <button
        onClick={toggleSave}
        aria-label={saved ? "Quitar de Cineteca" : "Guardar en Cineteca"}
        className="absolute right-1.5 top-1.5 rounded-full bg-surface/80 p-1.5 text-ink backdrop-blur-sm hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
      >
        {saved ? (
          <BookmarkCheck className="h-4 w-4 text-brand" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </button>
    </div>
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
