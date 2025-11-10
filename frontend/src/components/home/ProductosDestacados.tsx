import React from "react";

const mockProductos = [
  { id: 1, nombre: "Taladro inalámbrico", precio: 220.0, imagen: "/assets/prod1.jpg" },
  { id: 2, nombre: "Sierra circular", precio: 340.0, imagen: "/assets/prod2.jpg" },
  { id: 3, nombre: "Juego de llaves", precio: 95.0, imagen: "/assets/prod3.jpg" },
];

const ProductosDestacados: React.FC = () => {
  return (
    <section className="productos-section">
      <h2 className="section-title">🛠️ Productos destacados</h2>
      <div className="productos-grid">
        {mockProductos.map((p) => (
          <div key={p.id} className="producto-card">
            <img src={p.imagen} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p>S/ {p.precio.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductosDestacados;
