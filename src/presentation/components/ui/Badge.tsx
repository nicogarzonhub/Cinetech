import type { HTMLAttributes } from "react";
import clsx from "clsx";

export type BadgeTone = "released" | "unreleased" | "unknown";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

/**
 * Etiqueta corta para comunicar un estado, por ejemplo "Sin estrenar"
 * sobre la tarjeta de una película. El texto siempre va adentro: el
 * color por sí solo no cuenta como señal de estado (regla de accesibilidad
 * del proyecto).
 *
 * `tone` usa los mismos tokens de color que ya viven en `index.css`
 * (`--color-status-*`), así que si mañana cambia un color, se toca una
 * sola línea y este componente no se entera.
 */
export function Badge({
  children,
  tone = "unknown",
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-surface",
        tone === "released" && "bg-status-released",
        tone === "unreleased" && "bg-status-unreleased",
        tone === "unknown" && "bg-status-unknown",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
