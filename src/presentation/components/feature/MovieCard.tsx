import type { MovieSummary, ReleaseStatus } from '@/domain/movie/movie-summary';
import { Badge, type BadgeTone } from '@/presentation/components/ui/Badge';
import { movieCardCopy } from '@/presentation/copy/movieCard';

export type MovieCardProps = {
  movie: MovieSummary;
};

const TONE_BY_STATUS: Record<ReleaseStatus['kind'], BadgeTone> = {
  released: 'released',
  upcoming: 'unreleased',
  unknown: 'unknown',
};

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeZone: 'UTC' });

function statusWord(status: ReleaseStatus): string {
  switch (status.kind) {
    case 'released':
      return movieCardCopy.statusReleased;
    case 'upcoming':
      return movieCardCopy.statusUpcoming;
    case 'unknown':
      return movieCardCopy.statusUnknown;
  }
}

function releaseSentence(status: ReleaseStatus): string {
  switch (status.kind) {
    case 'released':
      return movieCardCopy.releasedOn(dateFormatter.format(status.releaseDate));
    case 'upcoming':
      return movieCardCopy.releasesOn(dateFormatter.format(status.releaseDate));
    case 'unknown':
      return movieCardCopy.dateUnknown;
  }
}

export function MovieCard({ movie }: MovieCardProps) {
  const tone = TONE_BY_STATUS[movie.releaseStatus.kind];

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

        <div className="mt-auto flex flex-col items-start gap-1">
          <Badge tone={tone}>{statusWord(movie.releaseStatus)}</Badge>
          <p className="text-xs text-ink-muted">{releaseSentence(movie.releaseStatus)}</p>
        </div>
      </div>
    </a>
  );
}
