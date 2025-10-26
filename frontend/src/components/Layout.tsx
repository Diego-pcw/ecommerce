// src/components/Layout.tsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

const Layout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold">Mi Tienda</Link>

          <nav className="flex items-center gap-4">
            <Link to="/productos" className="text-sm">Productos</Link>
            <Link to="/categorias" className="text-sm">Categorías</Link>

            {user ? (
              <>
                <Link to="/profile" className="text-sm">
                  {user.name ?? (user as any).name ?? "Perfil"}
                </Link>

                {user.rol === "admin" && (
                  <Link to="/admin/dashboard" className="text-sm">Admin</Link>
                )}

                <button
                  onClick={() => logout()}
                  className="text-sm text-red-600 hover:underline"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm">Iniciar sesión</Link>
                <Link to="/register" className="text-sm">Registrarse</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-gray-100">
        <div className="container mx-auto px-4 py-4 text-sm text-gray-600">
          © {new Date().getFullYear()} Mi Tienda - Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
