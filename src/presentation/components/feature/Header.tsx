import { Link } from "react-router";

export function Header() {
  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-surface-raised bg-surface px-4 py-3 text-ink">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <img
          src={`${import.meta.env.BASE_URL}favicon.svg`}
          alt=""
          className="h-8 w-8"
        />
        Cinetech
      </Link>

      <nav aria-label="Principal">
        <ul className="flex gap-4 text-sm">
          <li>
            <Link
              to="/"
              className="rounded-card px-2 py-1 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/explorar"
              className="rounded-card px-2 py-1 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Películas
            </Link>
          </li>
          <li>
            <Link
              to="/cineteca"
              className="rounded-card px-2 py-1 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Cineteca
            </Link>
          </li>
          <li>
            <Link
              to="/buscar"
              className="rounded-card px-2 py-1 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Búsqueda
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
