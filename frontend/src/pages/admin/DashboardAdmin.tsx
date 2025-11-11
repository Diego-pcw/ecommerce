import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/admin/dashboard.shared.css'; // ✅ Usamos el nuevo CSS
import {
  Package,
  LayoutGrid,
  Image,
  Users,
  MessageSquare,
  ShoppingCart,
  Tag,
  Star,
  MessageSquareText,
  Settings,
  ArrowLeft,
} from 'lucide-react';

const DashboardAdmin: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Panel de <span>Administración</span>
        </h1>
        <p className="dashboard-subtitle">
          Gestiona usuarios, productos, categorías, promociones y más desde un
          solo lugar.
        </p>
      </div>

      <ul className="dashboard-grid">
        {/* 🧾 Gestión principal */}
        <li>
          <Link to="/admin/productos" className="dashboard-card primary">
            <span className="icon">
              <Package />
            </span>
            <span>Productos y Ofertas</span>
          </Link>
        </li>
        <li>
          <Link to="/productos" className="dashboard-card">
            <span className="icon">🛍️</span>
            <span>Ver Tienda (Público)</span>
          </Link>
        </li>
        <li>
          <Link to="/categorias" className="dashboard-card">
            <span className="icon">
              <LayoutGrid />
            </span>
            <span>Categorías</span>
          </Link>
        </li>
        <li>
          <Link to="/imagenes" className="dashboard-card">
            <span className="icon">
              <Image />
            </span>
            <span>Imágenes</span>
          </Link>
        </li>

        {/* 🧑‍💼 Usuarios y contactos */}
        <li>
          <Link to="/admin/usuarios" className="dashboard-card">
            <span className="icon">
              <Users />
            </span>
            <span>Usuarios</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/contactos" className="dashboard-card">
            <span className="icon">
              <MessageSquare />
            </span>
            <span>Mensajes de Contacto</span>
          </Link>
        </li>
        <li>
          <Link to="/carritos" className="dashboard-card">
            <span className="icon">
              <ShoppingCart />
            </span>
            <span>Carritos de Clientes</span>
          </Link>
        </li>

        {/* 🏷️ Promociones */}
        <li>
          <Link to="/promociones" className="dashboard-card">
            <span className="icon">
              <Tag />
            </span>
            <span>Promociones Activas</span>
          </Link>
        </li>

        {/* ⭐ Reseñas */}
        <li>
          <Link to="/resenas" className="dashboard-card">
            <span className="icon">
              <Star />
            </span>
            <span>Moderar Reseñas</span>
          </Link>
        </li>
        <li>
          <Link to="/resenas-public" className="dashboard-card">
            <span className="icon">
              <MessageSquareText />
            </span>
            <span>Opiniones Públicas</span>
          </Link>
        </li>

        {/* ⚙️ Opcional: configuración futura */}
        <li>
          <Link to="/admin/configuracion" className="dashboard-card">
            <span className="icon">
              <Settings />
            </span>
            <span>Configuración</span>
          </Link>
        </li>
      </ul>

      <div className="dashboard-footer">
        <Link to="/" className="btn btn-outline">
          <ArrowLeft size={16} />
          Volver al inicio público
        </Link>
      </div>
    </div>
  );
};

export default DashboardAdmin;