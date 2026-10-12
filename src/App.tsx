import { Navigate, Route, Routes, useParams } from "react-router";
import { useEffect } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Success from "./pages/Success";
import Admin from "./pages/Admin";
import { useI18n } from "@/lib/i18n";
import { isLang } from "@/content";

/** /en, /pt, /id, /es and /pl each open the home page in that language. */
function LangHome() {
  const { lang: param } = useParams();
  const { setLang } = useI18n();
  const valid = isLang(param);

  useEffect(() => {
    if (isLang(param)) setLang(param);
  }, [param, setLang]);

  return valid ? <Home /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:lang" element={<LangHome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/success" element={<Success />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
