import { z } from "zod";

const releaseStatusSchema = z.union([
  z.object({
    kind: z.literal("unknown"),
  }),
  z.object({
    kind: z.literal("released"),
    releaseDate: z.coerce.date(),
  }),
  z.object({
    kind: z.literal("upcoming"),
    releaseDate: z.coerce.date(),
  }),
]);

const movieSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  posterUrl: z.string().nullable(),
  releaseStatus: releaseStatusSchema,
});

export const customListSchema = z.object({
  id: z.string(),
  name: z.string(),
  movieIds: z.array(z.number()),
});

export const cinetecaStateSchema = z.object({
  savedMovies: z.record(z.coerce.number(), movieSummarySchema),
  lists: z.array(customListSchema),
});
