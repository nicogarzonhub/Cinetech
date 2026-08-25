import axios, { AxiosError } from "axios";
import { env } from "@/config/env";
import { ApiError } from "@/domain/shared/api-error";

/**
 * Única instancia de axios del proyecto. Solo este directorio puede
 * importar axios (lo impone el linter): si el transporte cambia mañana,
 * cambia un archivo, no cuarenta componentes.
 */
export const httpClient = axios.create({
  baseURL: `${env.VITE_TMDB_API_BASE}/3`,
  headers: { Authorization: `Bearer ${env.VITE_TMDB_READ_TOKEN}` },
});

type TmdbErrorBody = { status_code?: number; status_message?: string };

// TMDB manda su propio código en el cuerpo de la respuesta, y ese código
// NO coincide con el HTTP: "no encontrado" es su 34 sobre un 404 HTTP,
// "página inválida" es su 22 sobre un 400 HTTP. Esta traducción se hace
// una sola vez, aquí, en el borde.
httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!(error instanceof AxiosError)) {
      return Promise.reject(
        new ApiError("unknown", "Ocurrió un error inesperado."),
      );
    }

    if (!error.response) {
      return Promise.reject(
        new ApiError("network", "No hay conexión con el servidor."),
      );
    }

    if (error.response.status === 429) {
      return Promise.reject(
        new ApiError("rate-limited", "Vamos demasiado rápido, reintentando."),
      );
    }

    const body = error.response.data as TmdbErrorBody | undefined;
    if (body?.status_code === 34) {
      return Promise.reject(
        new ApiError("not-found", "No encontramos ese recurso."),
      );
    }
    if (body?.status_code === 22) {
      return Promise.reject(
        new ApiError("invalid-request", "La solicitud no es válida."),
      );
    }

    return Promise.reject(
      new ApiError("unknown", "No pudimos completar la petición."),
    );
  },
);
