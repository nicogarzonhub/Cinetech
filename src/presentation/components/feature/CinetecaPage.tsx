import { useState } from "react";
import { Link } from "react-router";
import { useCineteca } from "@/presentation/providers/CinetecaProvider";
import { MovieCard } from "@/presentation/components/feature/MovieCard";
import { Button } from "@/presentation/components/ui/Button";
import { Plus, Trash, Edit2, Check, X } from "lucide-react";
import type { CustomList } from "@/domain/cineteca/Cineteca";

export function CinetecaPage() {
  const {
    state,
    createList,
    deleteList,
    editList,
    addMovieToList,
    removeMovieFromList,
  } = useCineteca();
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const savedMoviesList = Object.values(state.savedMovies);

  const handleCreateList = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList(newListName);
      setNewListName("");
    }
  };

  const handleStartEdit = (list: CustomList) => {
    setEditingListId(list.id);
    setEditName(list.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      editList(id, editName);
    }
    setEditingListId(null);
  };

  const handleAddToList = (
    listId: string,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const movieId = Number(e.target.value);
    if (!movieId) return;
    const movie = state.savedMovies[movieId];
    if (movie) {
      addMovieToList(listId, movie);
    }
    e.target.value = ""; // reset select
  };

  return (
    <main className="min-h-screen bg-surface p-8 text-ink">
      <h1 className="mb-6 text-3xl font-semibold">Mi Cineteca</h1>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Películas Guardadas</h2>
        {savedMoviesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-card bg-surface-raised p-12 text-center text-ink-muted">
            <p className="mb-4">Tu cineteca está vacía</p>
            <Button asChild>
              <Link to="/">Explorar películas</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {savedMoviesList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Listas Personalizadas</h2>

        <form onSubmit={handleCreateList} className="mb-6 flex gap-2 max-w-md">
          <input
            type="text"
            value={newListName}
            onChange={(e) => {
              setNewListName(e.target.value);
            }}
            placeholder="Nueva lista..."
            className="flex-1 rounded-card border border-surface-raised bg-surface-raised px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
          <Button type="submit" disabled={!newListName.trim()}>
            <Plus className="mr-2 h-4 w-4" /> Crear
          </Button>
        </form>

        {state.lists.length === 0 ? (
          <p className="text-ink-muted">No tienes listas personalizadas.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {state.lists.map((list) => (
              <div
                key={list.id}
                className="rounded-card border border-surface-raised p-6"
              >
                <div className="mb-4 flex items-center justify-between border-b border-surface-raised pb-4">
                  {editingListId === list.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editName}
                        onChange={(e) => {
                          setEditName(e.target.value);
                        }}
                        className="rounded border border-surface-raised bg-surface px-2 py-1"
                      />
                      <button
                        onClick={() => {
                          handleSaveEdit(list.id);
                        }}
                        className="p-1 text-green-500 hover:text-green-400"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingListId(null);
                        }}
                        className="p-1 text-red-500 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{list.name}</h3>
                      <button
                        onClick={() => {
                          handleStartEdit(list);
                        }}
                        className="p-1 text-ink-muted hover:text-ink"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {savedMoviesList.length > 0 && (
                      <select
                        onChange={(e) => {
                          handleAddToList(list.id, e);
                        }}
                        defaultValue=""
                        className="rounded border border-surface-raised bg-surface px-2 py-1 text-sm text-ink outline-none focus:border-brand"
                      >
                        <option value="" disabled>
                          Agregar película...
                        </option>
                        {savedMoviesList
                          .filter((m) => !list.movieIds.includes(m.id))
                          .map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.title}
                            </option>
                          ))}
                      </select>
                    )}
                    <button
                      onClick={() => {
                        deleteList(list.id);
                      }}
                      className="text-red-500 hover:text-red-400"
                      aria-label={`Eliminar lista ${list.name}`}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {list.movieIds.length === 0 ? (
                  <p className="text-sm text-ink-muted">
                    Esta lista no tiene películas todavía.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {list.movieIds.map((movieId) => {
                      const movie = state.savedMovies[movieId];
                      if (!movie) return null;
                      return (
                        <div key={movie.id} className="relative group">
                          <MovieCard movie={movie} />
                          <button
                            onClick={() => {
                              removeMovieFromList(list.id, movie.id);
                            }}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                            aria-label="Quitar de la lista"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
