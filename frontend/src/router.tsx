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

// 📦 Productos (solo admin)
import ProductosList from "./pages/productos/ProductosList";
import ProductoDetail from "./pages/productos/ProductoDetail";
import ProductoCreate from "./pages/productos/ProductoCreate";
import ProductoEdit from "./pages/productos/ProductoEdit";

// 🖼️ Imágenes de productos (solo admin)
import ImagenesIndex from "./pages/imagenes/ImagenesIndex";
import ImagenesCreate from "./pages/imagenes/ImagenesCreate";
import ImagenesEdit from "./pages/imagenes/ImagenesEdit";
import ImagenesShow from "./pages/imagenes/ImagenesShow";

// 💸 Promociones (solo admin)
import PromocionList from "./pages/promociones/PromocionList";
import PromocionDetail from "./pages/promociones/PromocionDetail";
import PromocionCreate from "./pages/promociones/PromocionCreate";
import PromocionEdit from "./pages/promociones/PromocionEdit";

// 👥 Usuarios (solo admin)
import UsuarioList from "./pages/admin/usuarios/UsuarioList";

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

        {/* Rutas de administración */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          {/* Categorías */}
          <Route path="/categorias" element={<CategoriaList />} />
          <Route path="/categorias/crear" element={<CategoriaCreate />} />
          <Route path="/categorias/editar/:id" element={<CategoriaEdit />} />

          {/* Productos */}
          <Route path="/productos" element={<ProductosList />} />
          <Route path="/productos/crear" element={<ProductoCreate />} />
          <Route path="/productos/:id" element={<ProductoDetail />} />
          <Route path="/productos/editar/:id" element={<ProductoEdit />} />

          {/* Imágenes de productos */}
          <Route path="/imagenes" element={<ImagenesIndex />} />
          <Route path="/imagenes/crear" element={<ImagenesCreate />} />
          <Route path="/imagenes/editar/:id" element={<ImagenesEdit />} />
          <Route path="/imagenes/:id" element={<ImagenesShow />} />

          {/* Promociones */}
          <Route path="/promociones" element={<PromocionList />} />
          <Route path="/promociones/crear" element={<PromocionCreate />} />
          <Route path="/promociones/:id" element={<PromocionDetail />} />
          <Route path="/promociones/editar/:id" element={<PromocionEdit />} />

          {/* Usuarios */}
          <Route path="/admin/usuarios" element={<UsuarioList />} />
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
