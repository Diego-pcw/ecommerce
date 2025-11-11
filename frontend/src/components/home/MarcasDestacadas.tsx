import React from 'react';
import '../../styles/home.shared.css'; // Importamos el CSS

// Datos simulados tematizados
const marcas = [
  { nombre: 'Honda', logo: 'https://placehold.co/150x60/ffffff/999?text=Honda' },
  { nombre: 'Yamaha', logo: 'https://placehold.co/150x60/ffffff/999?text=Yamaha' },
  { nombre: 'Suzuki', logo: 'https://placehold.co/150x60/ffffff/999?text=Suzuki' },
  { nombre: 'Kawasaki', logo: 'https://placehold.co/150x60/ffffff/999?text=Kawasaki' },
];

const MarcasDestacadas: React.FC = () => {
  return (
    <>
      <h2 className="home-section-title" style={{marginBottom: '2rem'}}>Marcas <span>Destacadas</span></h2>
      <div className="brands-grid">
        {marcas.map((marca) => (
          <div key={marca.nombre} className="brand-card-simple">
            <img 
              src={marca.logo} 
              alt={marca.nombre} 
              className="brand-logo"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default MarcasDestacadas;