import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { env } from "@/config/env";
import { ApiError } from "@/domain/shared/api-error";
import { server } from "@/test/msw/server";
import { tmdbMoviesRepository } from "./tmdb-movies-repository";

const TRENDING_URL = `${env.VITE_TMDB_API_BASE}/3/trending/movie/week`;
const now = new Date("2026-08-24T00:00:00.000Z");

describe("tmdbMoviesRepository.getTrendingThisWeek", () => {
  it("mapea una respuesta válida a MovieSummary, incluida la URL del póster", async () => {
    server.use(
      http.get(TRENDING_URL, () =>
        HttpResponse.json({
          results: [
            {
              id: 238,
              title: "El padrino",
              poster_path: "/poster.jpg",
              release_date: "1972-03-24",
            },
          ],
        }),
      ),
    );

    const movies = await tmdbMoviesRepository.getTrendingThisWeek(now);

    expect(movies).toEqual([
      {
        id: 238,
        title: "El padrino",
        posterUrl: `${env.VITE_TMDB_IMAGE_BASE}/w342/poster.jpg`,
        releaseStatus: {
          kind: "released",
          releaseDate: new Date("1972-03-24"),
        },
      },
    ]);
  });

  it("traduce un póster ausente a `posterUrl: null`, nunca a una URL rota", async () => {
    server.use(
      http.get(TRENDING_URL, () =>
        HttpResponse.json({
          results: [
            { id: 1, title: "Sin póster", poster_path: null, release_date: "" },
          ],
        }),
      ),
    );

    const [movie] = await tmdbMoviesRepository.getTrendingThisWeek(now);

    expect(movie?.posterUrl).toBeNull();
    expect(movie?.releaseStatus).toEqual({ kind: "unknown" });
  });

  it("lanza ApiError cuando la respuesta no tiene la forma esperada, sin reventar con una afirmación de tipo", async () => {
    server.use(
      http.get(TRENDING_URL, () =>
        HttpResponse.json({ results: [{ id: "no-es-un-número" }] }),
      ),
    );

    await expect(
      tmdbMoviesRepository.getTrendingThisWeek(now),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('traduce el código 34 de TMDB ("no encontrado") sobre un 404 en un ApiError con reason "not-found"', async () => {
    server.use(
      http.get(TRENDING_URL, () =>
        HttpResponse.json(
          { status_code: 34, status_message: "not found" },
          { status: 404 },
        ),
      ),
    );

    await expect(
      tmdbMoviesRepository.getTrendingThisWeek(now),
    ).rejects.toMatchObject({
      reason: "not-found",
    });
  });

  it('traduce un 429 en un ApiError con reason "rate-limited"', async () => {
    server.use(
      http.get(TRENDING_URL, () => new HttpResponse(null, { status: 429 })),
    );

    await expect(
      tmdbMoviesRepository.getTrendingThisWeek(now),
    ).rejects.toMatchObject({
      reason: "rate-limited",
    });
  });
});
