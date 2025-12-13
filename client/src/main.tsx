import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Lightweight RTL support for Arabic browsers (app UI).
try {
  const lang = (navigator.language || "en").toLowerCase();
  const isArabic = lang.startsWith("ar");
  const root = document.documentElement;
  root.lang = isArabic ? "ar" : "en";
  root.dir = isArabic ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", isArabic);
} catch {
  // ignore
}

createRoot(document.getElementById("root")!).render(<App />);
