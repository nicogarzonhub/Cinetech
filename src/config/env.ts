import { z } from "zod";

const envSchema = z.object({
  VITE_TMDB_READ_TOKEN: z
    .string()
    .min(40, "Falta el API Read Access Token de TMDB"),
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  VITE_TMDB_API_BASE: z.string().url().default("https://api.themoviedb.org"),
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  VITE_TMDB_IMAGE_BASE: z.string().url().default("https://image.tmdb.org/t/p"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(`Configuración inválida:\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
