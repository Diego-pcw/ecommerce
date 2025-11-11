import React from 'react';
import '../../styles/home.shared.css'; // Importamos el CSS
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PromocionesDestacadas: React.FC = () => {
  return (
    // Ya no es una sección, sino el contenido de la sección
    <div className="promo-highlight-banner">
      <p>
        ¡Hasta <span>40% OFF</span> en Cascos y Guantes seleccionados! ⚡
      </p>
      <Link to="/promociones" className="btn">
        Ver ofertas
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default PromocionesDestacadas;