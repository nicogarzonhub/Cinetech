import type { MovieSummary } from "../movie/movie-summary";

export interface CustomList {
  id: string;
  name: string;
  movieIds: number[];
}

export interface CinetecaState {
  savedMovies: Record<number, MovieSummary>;
  lists: CustomList[];
}
