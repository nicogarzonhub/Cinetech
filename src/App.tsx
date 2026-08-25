import { BrowserRouter, Routes, Route } from "react-router";
import { RootLayout } from "@/presentation/pages/RootLayout";
import { Home } from "@/presentation/pages/Home";
import { Explore } from "@/presentation/pages/Explore";
import { Search } from "@/presentation/pages/Search";
import { MovieDetail } from "@/presentation/pages/MovieDetail";
import { Library } from "@/presentation/pages/Library";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="explorar" element={<Explore />} />
          <Route path="buscar" element={<Search />} />
          <Route path="cineteca" element={<Library />} />
          <Route path="pelicula/:id" element={<MovieDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
