import type { ReleaseStatus } from './movie-summary';

/**
 * Traduce la fecha de estreno cruda de TMDB a un estado del dominio.
 *
 * `now` entra por parámetro en vez de leerse aquí con `new Date()` por dos
 * razones: la función queda determinista (mismo input, mismo output,
 * comprobable con cualquier reloj) y no queda ninguna duda de qué "ahora"
 * está usando el resto de la pantalla — todos comparten el mismo.
 */
export function getReleaseStatus(
  rawReleaseDate: string | null | undefined,
  now: Date,
): ReleaseStatus {
  // TMDB no manda `null`: manda `""`. Los dos significan lo mismo.
  if (!rawReleaseDate) return { kind: 'unknown' };

  const releaseDate = new Date(rawReleaseDate);
  if (Number.isNaN(releaseDate.getTime())) return { kind: 'unknown' };

  return releaseDate.getTime() > now.getTime()
    ? { kind: 'upcoming', releaseDate }
    : { kind: 'released', releaseDate };
}
