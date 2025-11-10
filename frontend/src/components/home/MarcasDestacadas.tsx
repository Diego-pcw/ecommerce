import React from "react";
import "@/styles/home.shared.css";

const marcas = [
  { nombre: "Bosch", logo: "/assets/marcas/bosch.png" },
  { nombre: "Makita", logo: "/assets/marcas/makita.png" },
  { nombre: "Stanley", logo: "/assets/marcas/stanley.png" },
  { nombre: "Dewalt", logo: "/assets/marcas/dewalt.png" },
];

const MarcasDestacadas: React.FC = () => {
  return (
    <section className="marcas-section">
      <h2 className="section-title">🏭 Marcas destacadas</h2>
      <div className="marcas-grid">
        {marcas.map((marca) => (
          <div key={marca.nombre} className="marca-card">
            <img src={marca.logo} alt={marca.nombre} className="marca-logo" />
            <p>{marca.nombre}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarcasDestacadas;
