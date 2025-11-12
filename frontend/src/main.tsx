import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { CarritoProvider } from "./context/CarritoContext";
// import "./index.css"; // ⛔️ ELIMINAMOS EL ARCHIVO ANTIGUO
import './styles/theme.css'; // ✅ AÑADIMOS NUESTRO TEMA GLOBAL

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <CarritoProvider>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </CarritoProvider>
  </BrowserRouter>
);
