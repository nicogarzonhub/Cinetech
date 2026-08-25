import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageCineteca } from "./local-storage-cineteca";
import type { MovieSummary } from "../../domain/movie/movie-summary";

describe("LocalStorageCineteca", () => {
  const dummyMovie: MovieSummary = {
    id: 123,
    title: "The Godfather",
    posterUrl: "/poster.jpg",
    releaseStatus: { kind: "released", releaseDate: new Date("1972-03-14") },
  };

  const dummyMovie2: MovieSummary = {
    id: 456,
    title: "Pulp Fiction",
    posterUrl: null,
    releaseStatus: { kind: "unknown" },
  };

  beforeEach(() => {
    localStorage.clear();
    // vitest handles crypto if run in jsdom environment, which we are in
  });

  it("getState returns initial state if empty", () => {
    const state = LocalStorageCineteca.getState();
    expect(state).toEqual({ savedMovies: {}, lists: [] });
  });

  it("getState returns initial state if data is corrupt", () => {
    localStorage.setItem("cineteca_state", "invalid json {");
    expect(LocalStorageCineteca.getState()).toEqual({
      savedMovies: {},
      lists: [],
    });

    localStorage.setItem(
      "cineteca_state",
      JSON.stringify({ invalidStructure: true }),
    );
    expect(LocalStorageCineteca.getState()).toEqual({
      savedMovies: {},
      lists: [],
    });
  });

  it("saveMovie saves a movie", () => {
    LocalStorageCineteca.saveMovie(dummyMovie);
    const state = LocalStorageCineteca.getState();
    expect(state.savedMovies[123]).toBeDefined();
    expect(state.savedMovies[123].title).toBe("The Godfather");
  });

  it("avoids duplicates when saving same movie twice", () => {
    LocalStorageCineteca.saveMovie(dummyMovie);
    LocalStorageCineteca.saveMovie(dummyMovie);
    const state = LocalStorageCineteca.getState();
    expect(Object.keys(state.savedMovies)).toHaveLength(1);
  });

  it("removeMovie removes a movie and also removes it from lists", () => {
    LocalStorageCineteca.saveMovie(dummyMovie);
    LocalStorageCineteca.createList("My List");
    let state = LocalStorageCineteca.getState();
    const listId = state.lists[0].id;
    LocalStorageCineteca.addMovieToList(listId, dummyMovie);

    LocalStorageCineteca.removeMovie(dummyMovie.id);

    state = LocalStorageCineteca.getState();
    expect(state.savedMovies[dummyMovie.id]).toBeUndefined();
    expect(state.lists[0].movieIds).toHaveLength(0);
  });

  it("createList creates a list", () => {
    LocalStorageCineteca.createList("Favorites");
    const state = LocalStorageCineteca.getState();
    expect(state.lists).toHaveLength(1);
    expect(state.lists[0].name).toBe("Favorites");
  });

  it("createList ignores empty name", () => {
    LocalStorageCineteca.createList("   ");
    const state = LocalStorageCineteca.getState();
    expect(state.lists).toHaveLength(0);
  });

  it("editList updates a list name", () => {
    LocalStorageCineteca.createList("Favorites");
    let state = LocalStorageCineteca.getState();
    const listId = state.lists[0].id;

    LocalStorageCineteca.editList(listId, "Top 10");
    state = LocalStorageCineteca.getState();
    expect(state.lists[0].name).toBe("Top 10");
  });

  it("deleteList removes a list", () => {
    LocalStorageCineteca.createList("Favorites");
    let state = LocalStorageCineteca.getState();
    const listId = state.lists[0].id;

    LocalStorageCineteca.deleteList(listId);
    state = LocalStorageCineteca.getState();
    expect(state.lists).toHaveLength(0);
  });

  it("addMovieToList adds a movie and avoids duplicates", () => {
    LocalStorageCineteca.createList("Favorites");
    let state = LocalStorageCineteca.getState();
    const listId = state.lists[0].id;

    LocalStorageCineteca.addMovieToList(listId, dummyMovie);
    LocalStorageCineteca.addMovieToList(listId, dummyMovie);

    state = LocalStorageCineteca.getState();
    expect(state.lists[0].movieIds).toHaveLength(1);
    expect(state.savedMovies[dummyMovie.id]).toBeDefined();
  });

  it("removeMovieFromList removes a movie from a specific list", () => {
    LocalStorageCineteca.createList("Favorites");
    let state = LocalStorageCineteca.getState();
    const listId = state.lists[0].id;

    LocalStorageCineteca.addMovieToList(listId, dummyMovie);
    LocalStorageCineteca.addMovieToList(listId, dummyMovie2);

    LocalStorageCineteca.removeMovieFromList(listId, dummyMovie.id);

    state = LocalStorageCineteca.getState();
    expect(state.lists[0].movieIds).toEqual([456]);
    // The movie remains in savedMovies
    expect(state.savedMovies[123]).toBeDefined();
  });
});
