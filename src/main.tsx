import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import App from "./App.tsx";

const CvExperiencePage = lazy(() => import("./pages/CvExperiencePage"));
const RoomExperiencePage = lazy(() => import("./pages/RoomExperiencePage"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-[#050805] font-mono text-[#33ff33]">
            Loading experience...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/cv" element={<CvExperiencePage />} />
          <Route path="/room" element={<RoomExperiencePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
