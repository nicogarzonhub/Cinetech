import { describe, expect, it } from "vitest";
import { getReleaseStatus } from "./release-status";

describe("getReleaseStatus", () => {
  const now = new Date("2026-08-24T00:00:00.000Z");

  it('trata la cadena vacía de TMDB como "sin dato", no como una fecha', () => {
    expect(getReleaseStatus("", now)).toEqual({ kind: "unknown" });
  });

  it('trata null y undefined como "sin dato"', () => {
    expect(getReleaseStatus(null, now)).toEqual({ kind: "unknown" });
    expect(getReleaseStatus(undefined, now)).toEqual({ kind: "unknown" });
  });

  it("descarta una fecha que no se puede parsear", () => {
    expect(getReleaseStatus("no-es-una-fecha", now)).toEqual({
      kind: "unknown",
    });
  });

  it('marca como estrenada una fecha anterior a "ahora"', () => {
    expect(getReleaseStatus("2020-01-01", now).kind).toBe("released");
  });

  it('marca como estrenada una fecha igual a "ahora"', () => {
    expect(getReleaseStatus(now.toISOString(), now).kind).toBe("released");
  });

  it('marca como próxima una fecha posterior a "ahora"', () => {
    expect(getReleaseStatus("2027-01-01", now).kind).toBe("upcoming");
  });

  it('no consulta el reloj del sistema: el mismo estreno cambia de estado según el "ahora" recibido', () => {
    const releaseDate = "2026-08-24";
    expect(getReleaseStatus(releaseDate, new Date("2000-01-01")).kind).toBe(
      "upcoming",
    );
    expect(getReleaseStatus(releaseDate, new Date("2100-01-01")).kind).toBe(
      "released",
    );
  });
});
