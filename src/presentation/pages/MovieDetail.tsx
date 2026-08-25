import { useParams } from "react-router";

export function MovieDetail() {
  const { id } = useParams();

  return (
    <main className="min-h-screen bg-surface p-8 text-ink">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-2xl font-semibold">Detalle de Película</h1>
        <p className="text-ink-muted">Cargando datos para el ID: {id}</p>
        {/* Aquí irá la ficha completa de la película */}
      </div>
    </main>
  );
}
