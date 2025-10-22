import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 🔐 Páginas de autenticación
import Login from './pages/Login';
import Register from './pages/Register';

// 👤 Perfil y panel de usuario
import Profile from './pages/Profile';
import UserHome from './pages/UserHome';

// 🧱 Layout general (con header/footer y <Outlet />)
import Layout from './components/Layout';
import ToastRoot from './components/ToastRoot';

// 🛒 Módulo de productos
//import ProductosList from './pages/Productos/ProductosList';
//import ProductoDetail from './pages/Productos/ProductoDetail';
//import ProductoCreate from './pages/Productos/ProductoCreate';
//import ProductoEdit from './pages/Productos/ProductoEdit';

// 🏷️ Módulo de categorías
//import CategoriasList from './pages/Categorias/CategoriasList';
//import CategoriaCreate from './pages/Categorias/CategoriaCreate';
//import CategoriaEdit from './pages/Categorias/CategoriaEdit';

// 🖼️ Módulo de imágenes de productos
//import ImagenesList from './pages/Imagenes/ImagenesList';
//import ImagenCreate from './pages/Imagenes/ImagenCreate';
//import ImagenEdit from './pages/Imagenes/ImagenEdit';

// 🧰 Panel de administración
//import Dashboard from './pages/Admin/Dashboard';

// 🔒 Ruta protegida por autenticación / roles
import { ProtectedRoute } from './components/ProtectedRoute';

export default function Router() {
  return (
    <Routes>
      {/* ================================
          🔓 PÁGINAS PÚBLICAS (no login)
      ================================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout general (con header/footer y <Outlet />) */}
      <Route element={<Layout />}>
        <Route path="/" element={<UserHome />} />

        {/* Productos públicos */}
        

        {/* Categorías públicas */}
        

        {/* ================================
            🔐 RUTAS PROTEGIDAS (usuario logueado)
        ================================= */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ================================
            🛠️ RUTAS ADMIN (solo rol admin)
        ================================= */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          

          {/* CRUD Productos */}
          

          {/* CRUD Categorías */}
          

          {/* CRUD Imágenes */}
          
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
