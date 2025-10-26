import React from "react";
import "../styles/layout.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <p>© {new Date().getFullYear()} Mi Tienda. Todos los derechos reservados.</p>
        <p className="footer-subtext">Diseñado con 🖤 por Gonzalo</p>
      </div>
    </footer>
  );
};

export default Footer;
