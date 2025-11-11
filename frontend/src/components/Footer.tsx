import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.shared.css';
import {
  Facebook,
  Instagram,
  Youtube,
  Rocket,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main-grid">
          {/* Col 1: Logo y Redes */}
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <Rocket size={28} />
              Mi Tienda <span>Biker</span>
            </Link>
            <p>
              Tu parada número uno para accesorios, repuestos y todo lo que
              necesitas para tu motocicleta.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Youtube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Col 2: Enlaces Rápidos */}
          <div className="footer-col">
            <h4 className="footer-col-title">Enlaces Rápidos</h4>
            <ul className="footer-links">
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/categorias">Categorías</Link></li>
              <li><Link to="/profile">Mi Cuenta</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>

          {/* Col 3: Contacto */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contáctanos</h4>
            <ul className="footer-contact-info">
              <li><Phone size={16} /><span>+51 987 654 321</span></li>
              <li><Mail size={16} /><span>info@mitiendabiker.com</span></li>
              <li><MapPin size={16} /><span>Av. Principal 123, Lima, Perú</span></li>
            </ul>
          </div>

          {/* Col 4: Mapa */}
          <div className="footer-col">
            <h4 className="footer-col-title">Ubicación</h4>
            <div className="footer-map-placeholder">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d474.2859792079604!2d-70.2586793965774!3d-18.01184084395143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915acf864fa2a3d1%3A0xb98b15205a953f59!2sBIKER%20WOLF%20PER%C3%9A%20(accesorios%20para%20motos%20)!5e0!3m2!1ses!2spe!4v1762845389466!5m2!1ses!2spe"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Mi Tienda Biker. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
