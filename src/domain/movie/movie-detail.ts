export interface MoviePerson {
  id: number;
  name: string;
  character: string | null;
  profileUrl: string | null;
}

export interface MovieCompany {
  id: number;
  name: string;
  logoUrl: string | null;
}

/** La información que necesita la ficha, independiente de la forma cruda de TMDB. */
export interface MovieDetail {
  id: number;
  title: string;
  originalTitle: string;
  overview: string | null;
  tagline: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  runtime: number | null;
  genres: string[];
  voteAverage: number;
  voteCount: number;
  status: string;
  originalLanguage: string;
  spokenLanguages: string[];
  productionCountries: string[];
  productionCompanies: MovieCompany[];
  budget: number;
  revenue: number;
  homepage: string | null;
  imdbId: string | null;
  director: string | null;
  cast: MoviePerson[];
  trailerUrl: string | null;
}
