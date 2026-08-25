import { useSearchParams } from "react-router";

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const yearFilter = searchParams.get("year") ?? "";

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ year: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main className="min-h-screen bg-surface p-8 text-ink">
      <h1 className="mb-6 text-2xl font-semibold">Explorar Películas</h1>

      <div className="mb-6 flex gap-4">
        <select
          className="rounded border border-surface-raised bg-surface-raised px-3 py-2 text-sm"
          value={yearFilter}
          onChange={handleYearChange}
        >
          <option value="">Cualquier año</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>

      <div className="text-ink-muted">
        {/* Aquí irán los resultados filtrados */}
        <p>Mostrando resultados para: {yearFilter || "Todos los años"}</p>
      </div>
    </main>
  );
}
