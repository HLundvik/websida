import { createRoot } from "react-dom/client";
import { BeerPong } from "./BeerPong";

const container = document.getElementById("game");
if (container) {
  createRoot(container).render(
    <main className="flex min-h-screen items-center justify-center p-4"><BeerPong /></main>,
  );
}