import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";

// Lazy load page components
const Index = lazy(() => import("./pages/Index"));
const NewDocument = lazy(() => import("./pages/NewDocument"));
const EditDocument = lazy(() => import("./pages/EditDocument"));
const ViewDocument = lazy(() => import("./pages/ViewDocument"));
const NotFound = lazy(() => import("./pages/NotFound"));

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/new" element={<NewDocument />} />
        <Route path="/edit/:identifier" element={<EditDocument />} />
        <Route path="/document/:nip19" element={<ViewDocument />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;