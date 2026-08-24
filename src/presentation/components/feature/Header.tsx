
export function Header() {
  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-surface-raised bg-surface px-4 py-3 text-ink">
      <a href="/" className="flex items-center gap-2 font-semibold">
        <img src="/favicon.svg" alt="" className="h-8 w-8" />
        Cinetech
      </a>

      <nav aria-label="Principal">
        <ul className="flex gap-4 text-sm">
          <li>
            <a
              href="/"
              className="rounded-card px-2 py-1 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              href="/explorar"
              className="rounded-card px-2 py-1 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Películas
            </a>
          </li>
          <li>
            <a
              href="/cineteca"
              className="rounded-card px-2 py-1 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Cineteca
            </a>
          </li>
          <li>
            <a
              href="/buscar"
              className="rounded-card px-2 py-1 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Búsqueda
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
