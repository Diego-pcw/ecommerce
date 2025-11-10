import React from "react";

const PromocionesDestacadas: React.FC = () => {
  return (
    <section className="promos-section">
      <h2 className="section-title">🔥 Promociones de la semana</h2>
      <div className="promo-banner">
        <p>Hasta 40% de descuento en herramientas eléctricas ⚡</p>
        <button className="btn-home-primary">Ver ofertas</button>
      </div>
    </section>
  );
};

export default PromocionesDestacadas;
