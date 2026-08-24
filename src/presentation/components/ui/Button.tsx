import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

/**
 * Botón base del proyecto. La idea es tener UN solo componente de botón y
 * reutilizarlo en toda la app (reintentar, limpiar filtros, guardar...) en
 * vez de repetir las mismas clases de Tailwind por todos lados.
 *
 * - `primary`: la acción principal de la pantalla.
 * - `secondary`: una acción de apoyo, menos protagonista.
 * - `danger`: una acción destructiva, como "Quitar de la biblioteca".
 *
 * `min-h-touch` viene del token `--spacing-touch` del tema: así el botón
 * siempre tiene un área táctil mínima, sin escribir "44px" a mano.
 */
export function Button({
  children,
  variant = 'primary',
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex min-h-touch items-center justify-center rounded-card px-4 text-sm font-semibold transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-brand text-surface hover:opacity-90',
        variant === 'secondary' && 'bg-surface-raised text-ink hover:opacity-90',
        variant === 'danger' && 'bg-danger text-surface hover:opacity-90',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
