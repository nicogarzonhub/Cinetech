/**
 * Textos visibles de la tarjeta de película. Ningún string suelto dentro
 * del componente: si mañana cambia la redacción, se toca este archivo y
 * nada más.
 */
export const movieCardCopy = {
  posterFallback: 'Sin póster disponible',
  statusReleased: 'Estrenada',
  statusUpcoming: 'Próximamente',
  statusUnknown: 'Sin fecha',
  releasedOn: (date: string) => `Se estrenó el ${date}`,
  releasesOn: (date: string) => `Se estrena el ${date}`,
  dateUnknown: 'Fecha de estreno sin confirmar',
};
