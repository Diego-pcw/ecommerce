import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Settings, Droplet, ShieldCheck, ArrowRight } from 'lucide-react';
import '../../styles/home/serviciosdestac.shared.css';

// Datos de los servicios
const servicios = [
  {
    id: 1,
    titulo: 'Mantenimiento Preventivo',
    descripcion:
      'Asegura la vida útil de tu motor. Cambio de aceite, filtros, ajuste de frenos y revisión general por expertos.',
    icono: <Wrench size={28} />,
    imagen:
      'https://images.unsplash.com/photo-1596687950776-15e421902c5e?auto=format&fit=crop&w=800&q=80', // Mecánico trabajando
    link: '/servicios/mantenimiento',
  },
  {
    id: 2,
    titulo: 'Tuning & Performance',
    descripcion:
      'Lleva tu moto al siguiente nivel. Instalación de escapes, sistemas de carburación y mejoras de rendimiento.',
    icono: <Settings size={28} />,
    imagen:
      'https://images.unsplash.com/photo-1558980664-2506fca6bfc2?auto=format&fit=crop&w=800&q=80', // Moto custom detalle
    link: '/servicios/tuning',
  },
  {
    id: 3,
    titulo: 'Detailing & Lavado',
    descripcion:
      'Tu moto como nueva. Lavado profundo, encerado, pulido de plásticos y restauración de brillo.',
    icono: <Droplet size={28} />,
    imagen:
      'https://images.unsplash.com/photo-1600705722908-bab1e60997aa?auto=format&fit=crop&w=800&q=80', // Moto brillante/lavado
    link: '/servicios/detailing',
  },
  {
    id: 4,
    titulo: 'Instalación de Accesorios',
    descripcion:
      'Montaje profesional de alarmas, luces LED, maletas, defensas y sistemas de seguridad.',
    icono: <ShieldCheck size={28} />,
    imagen:
      'https://images.unsplash.com/photo-1623369024722-a923d2747829?auto=format&fit=crop&w=800&q=80', // Accesorios moto
    link: '/servicios/instalaciones',
  },
];

const ServiciosDestacados: React.FC = () => {
  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">
            Servicios <span>Especializados</span>
          </h2>
          <p className="services-subtitle">
            No solo vendemos productos, cuidamos de tu máquina. Conoce nuestros
            servicios de taller realizados por técnicos certificados.
          </p>
        </div>

        <div className="services-grid">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="service-card">
              <div className="service-image-wrapper">
                <img
                  src={servicio.imagen}
                  alt={servicio.titulo}
                  className="service-image"
                  loading="lazy"
                />
                <div className="service-overlay"></div>
                <div className="service-icon-box">{servicio.icono}</div>
              </div>

              <div className="service-content">
                <h3 className="service-title">{servicio.titulo}</h3>
                <p className="service-desc">{servicio.descripcion}</p>
                
                {/* Enlace simulado a contacto o detalle del servicio */}
                <Link to="/contacto" className="service-link">
                  Agendar Cita <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiciosDestacados;