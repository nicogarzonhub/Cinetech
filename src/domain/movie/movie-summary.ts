/**
 * Forma resumida de una película, la que devuelven `/discover/movie`,
 * `/search/movie` y `/trending/movie/week`. No es la ficha completa
 * (esa trae reparto, tráilers, presupuesto...): es justo lo necesario
 * para pintar una tarjeta en una cuadrícula.
 */
export type MovieSummary = {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseStatus: ReleaseStatus;
};

/**
 * El estreno de una película es uno de tres estados, nunca "una fecha que
 * puede estar vacía". `unknown` cubre tanto la cadena vacía que manda TMDB
 * cuando no hay fecha como una fecha imposible de parsear: en los dos
 * casos la respuesta correcta es "no lo sé", no "1 de enero de 1970".
 */
export type ReleaseStatus =
  | { kind: 'unknown' }
  | { kind: 'released'; releaseDate: Date }
  | { kind: 'upcoming'; releaseDate: Date };
