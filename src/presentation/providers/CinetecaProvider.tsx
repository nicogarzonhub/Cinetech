import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useCallback } from "react";
import type { CinetecaState } from "../../domain/cineteca/Cineteca";
import { LocalStorageCineteca } from "../../infrastructure/storage/local-storage-cineteca";
import type { MovieSummary } from "../../domain/movie/movie-summary";

interface CinetecaContextValue {
  state: CinetecaState;
  saveMovie: (movie: MovieSummary) => void;
  removeMovie: (id: number) => void;
  createList: (name: string) => void;
  editList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  addMovieToList: (listId: string, movie: MovieSummary) => void;
  removeMovieFromList: (listId: string, movieId: number) => void;
  isMovieSaved: (id: number) => boolean;
}

const CinetecaContext = createContext<CinetecaContextValue | undefined>(
  undefined,
);

export function CinetecaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CinetecaState>(() =>
    LocalStorageCineteca.getState(),
  );

  const saveMovie = useCallback((movie: MovieSummary) => {
    LocalStorageCineteca.saveMovie(movie);
    setState(LocalStorageCineteca.getState());
  }, []);

  const removeMovie = useCallback((id: number) => {
    LocalStorageCineteca.removeMovie(id);
    setState(LocalStorageCineteca.getState());
  }, []);

  const createList = useCallback((name: string) => {
    LocalStorageCineteca.createList(name);
    setState(LocalStorageCineteca.getState());
  }, []);

  const editList = useCallback((id: string, name: string) => {
    LocalStorageCineteca.editList(id, name);
    setState(LocalStorageCineteca.getState());
  }, []);

  const deleteList = useCallback((id: string) => {
    LocalStorageCineteca.deleteList(id);
    setState(LocalStorageCineteca.getState());
  }, []);

  const addMovieToList = useCallback((listId: string, movie: MovieSummary) => {
    LocalStorageCineteca.addMovieToList(listId, movie);
    setState(LocalStorageCineteca.getState());
  }, []);

  const removeMovieFromList = useCallback((listId: string, movieId: number) => {
    LocalStorageCineteca.removeMovieFromList(listId, movieId);
    setState(LocalStorageCineteca.getState());
  }, []);

  const isMovieSaved = useCallback(
    (id: number) => {
      return !!state.savedMovies[id];
    },
    [state.savedMovies],
  );

  const value = {
    state,
    saveMovie,
    removeMovie,
    createList,
    editList,
    deleteList,
    addMovieToList,
    removeMovieFromList,
    isMovieSaved,
  };

  return (
    <CinetecaContext.Provider value={value}>
      {children}
    </CinetecaContext.Provider>
  );
}

export function useCineteca() {
  const context = useContext(CinetecaContext);
  if (!context) {
    throw new Error("useCineteca must be used within a CinetecaProvider");
  }
  return context;
}
