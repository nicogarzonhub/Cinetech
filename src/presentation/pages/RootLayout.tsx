import { Outlet } from "react-router";
import { Header } from "@/presentation/components/feature/Header";

export function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
