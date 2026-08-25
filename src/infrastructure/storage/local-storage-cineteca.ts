import type { CinetecaState, CustomList } from "../../domain/cineteca/Cineteca";
import { cinetecaStateSchema } from "../../domain/cineteca/cineteca-schema";
import type { MovieSummary } from "../../domain/movie/movie-summary";

const STORAGE_KEY = "cineteca_state";

const getInitialState = (): CinetecaState => ({
  savedMovies: {},
  lists: [],
});

export const LocalStorageCineteca = {
  getState(): CinetecaState {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (!item) return getInitialState();

      const parsed: unknown = JSON.parse(item);
      const result = cinetecaStateSchema.safeParse(parsed);

      if (result.success) {
        return result.data;
      }

      console.warn(
        "Cineteca storage corrupted or invalid, resetting to empty state.",
        result.error,
      );
      return getInitialState();
    } catch {
      return getInitialState();
    }
  },

  saveState(state: CinetecaState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save Cineteca state to localStorage", e);
    }
  },

  saveMovie(movie: MovieSummary): void {
    const state = this.getState();
    state.savedMovies[movie.id] = movie;
    this.saveState(state);
  },

  removeMovie(id: number): void {
    const state = this.getState();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [id]: removed, ...remainingMovies } = state.savedMovies;
    state.savedMovies = remainingMovies;
    state.lists = state.lists.map((list) => ({
      ...list,
      movieIds: list.movieIds.filter((movieId) => movieId !== id),
    }));
    this.saveState(state);
  },

  createList(name: string): void {
    if (!name.trim()) return;
    const state = this.getState();
    const newList: CustomList = {
      id: crypto.randomUUID(),
      name: name.trim(),
      movieIds: [],
    };
    state.lists.push(newList);
    this.saveState(state);
  },

  editList(id: string, name: string): void {
    if (!name.trim()) return;
    const state = this.getState();
    const list = state.lists.find((l) => l.id === id);
    if (list) {
      list.name = name.trim();
      this.saveState(state);
    }
  },

  deleteList(id: string): void {
    const state = this.getState();
    state.lists = state.lists.filter((l) => l.id !== id);
    this.saveState(state);
  },

  addMovieToList(listId: string, movie: MovieSummary): void {
    const state = this.getState();
    state.savedMovies[movie.id] ??= movie;
    const list = state.lists.find((l) => l.id === listId);
    if (list && !list.movieIds.includes(movie.id)) {
      list.movieIds.push(movie.id);
      this.saveState(state);
    }
  },

  removeMovieFromList(listId: string, movieId: number): void {
    const state = this.getState();
    const list = state.lists.find((l) => l.id === listId);
    if (list) {
      list.movieIds = list.movieIds.filter((id) => id !== movieId);
      this.saveState(state);
    }
  },

  clearStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
