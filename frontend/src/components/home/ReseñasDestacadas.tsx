import React from "react";

const reseñas = [
  { nombre: "Carlos", texto: "Excelente calidad y rapidez en la entrega." },
  { nombre: "Lucía", texto: "Muy buena atención y productos confiables." },
  { nombre: "Andrés", texto: "Volveré a comprar sin duda alguna." },
];

const ReseñasDestacadas: React.FC = () => {
  return (
    <section className="reseñas-section">
      <h2 className="section-title">⭐ Opiniones de clientes</h2>
      <div className="reseñas-grid">
        {reseñas.map((r, i) => (
          <div key={i} className="reseña-card">
            <p className="reseña-text">“{r.texto}”</p>
            <p className="reseña-author">— {r.nombre}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReseñasDestacadas;
