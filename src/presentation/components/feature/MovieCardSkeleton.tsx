export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card bg-surface-raised transition-opacity">
      {/* Poster area skeleton */}
      <div className="aspect-poster w-full animate-pulse bg-surface-muted" />

      {/* Text area skeleton */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Title skeleton */}
        <div className="h-5 w-3/4 animate-pulse rounded bg-surface-muted" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-surface-muted" />

        <div className="mt-auto flex flex-col items-start gap-1 pt-2">
          {/* Badge skeleton */}
          <div className="h-5 w-16 animate-pulse rounded-full bg-surface-muted" />
          {/* Date skeleton */}
          <div className="mt-1 h-3 w-24 animate-pulse rounded bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}
