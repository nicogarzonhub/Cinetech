import { Link } from "react-router";

export function Library() {
  return (
    <main className="min-h-screen bg-surface p-8 text-ink">
      <h1 className="mb-6 text-2xl font-semibold">Mi Cineteca</h1>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="mb-4 text-ink-muted">Tu cineteca está vacía.</p>
        <Link
          to="/explorar"
          className="rounded-card bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Explorar películas
        </Link>
      </div>
    </main>
  );
}
