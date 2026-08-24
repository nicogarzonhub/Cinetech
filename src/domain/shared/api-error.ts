/**
 * Error de dominio para cualquier fallo al hablar con una API externa.
 * De la puerta de infraestructura para adentro, nadie vuelve a ver un
 * error crudo de axios ni un código HTTP suelto: solo esto.
 */
export type ApiErrorReason =
  | 'not-found' // TMDB status_code 34
  | 'invalid-request' // TMDB status_code 22
  | 'rate-limited' // HTTP 429
  | 'network' // sin respuesta: la red cayó
  | 'unknown';

export class ApiError extends Error {
  readonly reason: ApiErrorReason;

  constructor(reason: ApiErrorReason, message: string) {
    super(message);
    this.name = 'ApiError';
    this.reason = reason;
  }
}
