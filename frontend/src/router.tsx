// src/Router.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 🔐 Páginas de autenticación
import Login from "./pages/Login";
import Register from "./pages/Register";

// 👤 Perfil y home
import Profile from "./pages/Profile";
import UserHome from "./pages/UserHome";

// 🧱 Layout global
import Layout from "./components/Layout";

// 🔒 Rutas protegidas
import { ProtectedRoute } from "./components/ProtectedRoute";

// 🗂️ Categorías (solo admin)
import CategoriaList from "./pages/categorias/CategoriaList";
import CategoriaCreate from "./pages/categorias/CategoriaCreate";
import CategoriaEdit from "./pages/categorias/CategoriaEdit";

export default function Router() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout global */}
      <Route element={<Layout />}>
        {/* Página principal */}
        <Route path="/" element={<UserHome />} />

        {/* Rutas protegidas (usuarios autenticados) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin (categorías y otros futuros módulos) */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          {/* Categorías */}
          <Route path="/categorias" element={<CategoriaList />} />
          <Route path="/categorias/crear" element={<CategoriaCreate />} />
          <Route path="/categorias/editar/:id" element={<CategoriaEdit />} />
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
