import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Context / Provider del carrito
import { CarritoProvider } from "./context/CarritoContext";

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

// 🛒 Carrito (usuario)
import CarritoUserView from "./pages/carritos/CarritoUserView";
import CarritoCheckout from "./pages/carritos/CarritoCheckout";
import CarritoVacio from "./pages/carritos/CarritoVacio";

// 🧾 Carritos (admin) — ya los tenías
import CarritoList from "./pages/carritos/CarritoList";
import CarritoDetail from "./pages/carritos/CarritoDetail";

// 🗣️ Reseñas (usuarios y admin)
import ResenasList from "./pages/resenas/ResenasList";
import ResenaDetalle from "./pages/resenas/ResenaDetalle";
import ResenaForm from "./pages/resenas/ResenaForm";
import ResenasPublicList from "./pages/resenas/ResenasPublicList";

// 📬 Mensajes de contacto
// 📬 Mensajes de contacto
import ContactForm from "./components/contactos/ContactForm";
import ContactListUser from "./components/contactos/ContactListUser";
import ContactDetailUser from "./components/contactos/ContactDetailUser";
import ContactListAdmin from "./pages/contactos/ContactListAdmin";
import ContactDetail from "./pages/contactos/ContactDetail"; 

export default function Router() {
  return (
    // Proveedor global del carrito (disponible en toda la app)
    <CarritoProvider>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout global */}
        <Route element={<Layout />}>
          {/* Página principal */}
          <Route path="/" element={<UserHome />} />

          {/* Rutas del carrito (públicas, accesibles tanto por invitados como por usuarios) */}
          <Route path="/carrito" element={<CarritoUserView />} />
          <Route path="/carrito/checkout" element={<CarritoCheckout />} />
          <Route path="/carrito/vacio" element={<CarritoVacio />} />

          {/* Rutas de productos (públicas, accesibles tanto por invitados como por usuarios) */}
          <Route path="/productos" element={<ProductosList />} />
          <Route path="/productos/:id" element={<ProductoDetail />} />

          {/* Rutas de promocion (públicas, accesibles tanto por invitados como por usuarios) */}
          <Route path="/promociones" element={<PromocionList />} />
          <Route path="/promociones/:id" element={<PromocionDetail />} />

          {/* 🗣️ Rutas de reseñas (públicas y privadas según acción) */}
          <Route path="/resenas" element={<ResenasList />} />
          <Route path="/resenas/:id" element={<ResenaDetalle />} />
          <Route path="/resenas-public" element={<ResenasPublicList />} />
        
          {/* Rutas protegidas (usuarios autenticados) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />

            {/* 📬 Rutas de contacto */}
            <Route path="/contacto" element={<ContactForm />} />
            <Route path="/contacto/mis-mensajes" element={<ContactListUser />} />
            <Route path="/contacto/:id" element={<ContactDetailUser />} />
            
          </Route>

          {/* Rutas de administración */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            {/* Categorías */}
            <Route path="/categorias" element={<CategoriaList />} />
            <Route path="/categorias/crear" element={<CategoriaCreate />} />
            <Route path="/categorias/editar/:id" element={<CategoriaEdit />} />

            {/* Productos */}
            <Route path="/productos/crear" element={<ProductoCreate />} />
            <Route path="/productos/editar/:id" element={<ProductoEdit />} />

            {/* Imágenes de productos */}
            <Route path="/imagenes" element={<ImagenesIndex />} />
            <Route path="/imagenes/crear" element={<ImagenesCreate />} />
            <Route path="/imagenes/editar/:id" element={<ImagenesEdit />} />
            <Route path="/imagenes/:id" element={<ImagenesShow />} />

            {/* Promociones */}
            <Route path="/promociones/crear" element={<PromocionCreate />} />
            <Route path="/promociones/editar/:id" element={<PromocionEdit />} />

            {/* Usuarios */}
            <Route path="/admin/usuarios" element={<UsuarioList />} />

            {/* Admin: listado y detalle de carritos */}
            <Route path="/carritos" element={<CarritoList />} />
            <Route path="/carritos/:id" element={<CarritoDetail />} />

            {/* Contactos (solo admin) */}
            <Route path="/admin/contactos" element={<ContactListAdmin />} />
            <Route path="/admin/contactos/:id" element={<ContactDetail />} />
          </Route>
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CarritoProvider>
  );
}
