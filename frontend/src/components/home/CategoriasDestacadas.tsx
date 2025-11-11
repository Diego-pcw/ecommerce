import React from 'react';
import '../../styles/home.shared.css'; // Importamos el CSS
import { Wrench, Shield, Heart } from 'lucide-react'; // Icons
import { Link } from 'react-router-dom';

// Datos simulados tematizados y con iconos
const categorias = [
  {
    nombre: 'Repuestos',
    icono: <Wrench size={32} />,
    link: '/categorias/repuestos',
  },
  {
    nombre: 'Seguridad',
    icono: <Shield size={32} />,
    link: '/categorias/seguridad',
  },
  {
    nombre: 'Accesorios',
    icono: <Heart size={32} />,
    link: '/categorias/accesorios',
  },
];

const CategoriasDestacadas: React.FC = () => {
  return (
    <>
      <h2 className="home-section-title">📦 Explora <span>Categorías</span></h2>
      <div className="home-grid" style={{maxWidth: '1000px'}}>
        {categorias.map((cat) => (
          <Link to={cat.link} key={cat.nombre} className="category-card-simple">
            <div className="category-card-icon-wrapper">{cat.icono}</div>
            <p>{cat.nombre}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoriasDestacadas;