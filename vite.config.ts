import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // GitHub Pages publica los repositorios de proyecto bajo /<repositorio>/.
  // En local se conserva la raíz para que el servidor de Vite no cambie.
  base: process.env.GITHUB_ACTIONS ? "/Cinetech/" : "/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
