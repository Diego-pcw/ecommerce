import React from "react";

const categorias = [
  { nombre: "Herramientas eléctricas", icono: "⚡" },
  { nombre: "Accesorios", icono: "🧰" },
  { nombre: "Construcción", icono: "🏗️" },
  { nombre: "Seguridad", icono: "🦺" },
];

const CategoriasDestacadas: React.FC = () => {
  return (
    <section className="categorias-section">
      <h2 className="section-title">📦 Categorías destacadas</h2>
      <div className="categorias-grid">
        {categorias.map((cat) => (
          <div key={cat.nombre} className="categoria-card">
            <span className="categoria-icon">{cat.icono}</span>
            <p>{cat.nombre}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriasDestacadas;
