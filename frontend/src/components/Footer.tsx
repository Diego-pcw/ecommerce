import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Youtube,
  Rocket,
  MapPin,
  Phone,
  Mail,
  Twitter, // Usamos Twitter como X si no está disponible el icono específico
  ChevronRight,
} from 'lucide-react';
import '../styles/home/footer.shared.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Patrón de fondo sutil */}
      <div className="footer-bg-pattern" />
      
      <div className="footer-content">
        <div className="footer-main-grid">
          
          {/* Col 1: Marca y Redes */}
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <Rocket size={28} color="var(--color-primary)" />
              Mi Tienda <span>Biker</span>
            </Link>
            <p>
              Tu parada número uno para accesorios, repuestos y todo lo que
              necesitas para tu motocicleta. Calidad garantizada y pasión por las dos ruedas.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn facebook" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn instagram" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-btn youtube" aria-label="Youtube">
                <Youtube size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-btn tiktok" aria-label="X / Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Col 2: Navegación */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navegación</h4>
            <ul className="footer-links">
              <li>
                <Link to="/productos">
                  <ChevronRight size={16} color="var(--color-primary)" /> Productos
                </Link>
              </li>
              <li>
                <Link to="/categorias">
                  <ChevronRight size={16} color="var(--color-primary)" /> Categorías
                </Link>
              </li>
              <li>
                <Link to="/promociones">
                  <ChevronRight size={16} color="var(--color-primary)" /> Ofertas
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <ChevronRight size={16} color="var(--color-primary)" /> Mi Cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacto */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contáctanos</h4>
            <ul className="footer-contact-info">
              <li>
                <div className="contact-icon-box">
                  <Phone size={18} />
                </div>
                <div>
                  <strong>Llámanos</strong><br/>
                  <span>+51 987 654 321</span>
                </div>
              </li>
              <li>
                <div className="contact-icon-box">
                  <Mail size={18} />
                </div>
                <div>
                  <strong>Escríbenos</strong><br/>
                  <span>info@mitiendabiker.com</span>
                </div>
              </li>
              <li>
                <div className="contact-icon-box">
                  <MapPin size={18} />
                </div>
                <div>
                  <strong>Visítanos</strong><br/>
                  <span>Av. Principal 123, Lima, Perú</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Ubicación (Mapa) */}
          <div className="footer-col">
            <h4 className="footer-col-title">Ubicación</h4>
            <div className="footer-map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d474.2859792079604!2d-70.2586793965774!3d-18.01184084395143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915acf864fa2a3d1%3A0xb98b15205a953f59!2sBIKER%20WOLF%20PER%C3%9A%20(accesorios%20para%20motos%20)!5e0!3m2!1ses!2spe!4v1762845389466!5m2!1ses!2spe"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación Biker Wolf Perú"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="footer-bottom-bar">
          <p>
            © {new Date().getFullYear()} <strong>Mi Tienda Biker</strong>. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;