import React from 'react';
import '../../styles/home.shared.css'; // Importamos el CSS

// Datos simulados tematizados
const mockProductos = [
  {
    id: 1,
    nombre: 'Casco Integral Pro-Spec',
    precio: 450.0,
    imagen: 'https://inducascos.vtexassets.com/arquivos/ids/1863565-800-auto?v=638956403640370000&width=800&height=auto&aspect=true',
  },
  {
    id: 2,
    nombre: 'Guantes de Cuero Racing',
    precio: 180.0,
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_799501-MLU72114325529_102023-O.webp',
  },
  {
    id: 3,
    nombre: 'Aceite Sintético Motul 7100',
    precio: 95.0,
    imagen: 'https://m.media-amazon.com/images/I/71WUN0AwugL._AC_SL1080_.jpg',
  },
];

const ProductosDestacados: React.FC = () => {
  return (
    <>
      <h2 className="home-section-title">🛠️ Productos <span>Destacados</span></h2>
      <div className="home-grid">
        {mockProductos.map((p) => (
          <div key={p.id} className="product-card-simple">
            <img 
              src={p.imagen} 
              alt={p.nombre} 
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x300/f3f4f6/9ca3af?text=Error')}
            />
            <div className="product-card-simple-content">
              <h3>{p.nombre}</h3>
              <p>S/ {p.precio.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductosDestacados;