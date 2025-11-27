import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, Wrench, Truck, ArrowRight } from 'lucide-react';
import '../../styles/sobrenosotros.shared.css';

const SobreNosotros: React.FC = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* 📝 Contenido de Texto */}
        <div className="about-content">
          <div className="about-label">Nuestra Historia</div>
          
          <h2 className="about-title">
            Pasión por las <span>Dos Ruedas</span> desde el primer día
          </h2>
          
          <p className="about-description">
            En <strong>Mi Tienda Biker</strong>, no solo vendemos repuestos; vivimos la cultura del motociclismo. 
            Fundada por entusiastas para entusiastas, nuestra misión es equiparte con lo mejor del mercado 
            para que cada viaje sea seguro e inolvidable.
          </p>

          <div className="about-features">
            <div className="feature-item">
              <div className="feature-icon">
                <ShieldCheck size={18} />
              </div>
              <span>Garantía de Calidad</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Wrench size={18} />
              </div>
              <span>Soporte Técnico Experto</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Truck size={18} />
              </div>
              <span>Envíos a Todo el País</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Check size={18} />
              </div>
              <span>Repuestos Originales</span>
            </div>
          </div>

          <div className="about-cta">
            <Link to="/contacto" className="btn btn-primary">
              Contáctanos <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* 🖼️ Composición de Imágenes */}
        <div className="about-gallery">
          {/* Imagen Grande (Taller/Moto principal) */}
          <img 
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c3d?auto=format&fit=crop&w=800&q=80" 
            alt="Taller Biker" 
            className="gallery-img img-main"
          />
          
          {/* Imagen Pequeña 1 (Detalle/Accesorio) */}
          <img 
            src="https://images.unsplash.com/photo-1622185135505-2d79504399d9?auto=format&fit=crop&w=400&q=80" 
            alt="Casco Premium" 
            className="gallery-img img-small-1"
          />
          
          {/* Imagen Pequeña 2 (Acción/Ruta) */}
          <img 
            src="https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=400&q=80" 
            alt="Ruta en moto" 
            className="gallery-img img-small-2"
          />

          {/* Badge Flotante */}
          <div className="experience-badge">
            <span className="experience-number">10+</span>
            <span className="experience-text">Años de<br/>Experiencia</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreNosotros;