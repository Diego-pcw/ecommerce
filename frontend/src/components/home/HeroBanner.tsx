import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag } from 'lucide-react';
import '../../styles/home/herobanner.shared.css';

// Datos de los slides (Puedes cambiarlos dinámicamente si vienen de una API)
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80', // Moto en carretera
    tag: 'Nueva Colección 2024',
    title: 'Domina el',
    titleSpan: 'Asfalto', // Parte destacada
    desc: 'Equípate con lo último en seguridad y estilo. Cascos, chaquetas y guantes diseñados para la velocidad.',
    ctaText: 'Ver Catálogo',
    ctaLink: '/catalogo',
    secondaryText: 'Ofertas',
    secondaryLink: '/promociones'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=1920&q=80', // Primer plano motor/mecánica
    tag: 'Repuestos Originales',
    title: 'Tu Motor al',
    titleSpan: 'Máximo',
    desc: 'Mantén tu máquina rugiendo con nuestra selección de aceites, filtros y repuestos certificados.',
    ctaText: 'Buscar Repuestos',
    ctaLink: '/categorias',
    secondaryText: 'Servicios',
    secondaryLink: '/contacto'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1920&q=80', // Motociclista en paisaje
    tag: 'Aventura Sin Límites',
    title: 'Libertad en',
    titleSpan: 'Cada Ruta',
    desc: 'Accesorios de viaje y equipaje para que tu próxima travesía sea inolvidable.',
    ctaText: 'Ver Accesorios',
    ctaLink: '/productos?categoria=accesorios',
    secondaryText: 'Comunidad',
    secondaryLink: '/resenas-public'
  }
];

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Función para cambiar slide
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoPlaying(false); // Pausar si el usuario interactúa manualmente
  };

  // Autoplay
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // Cambia cada 5 segundos
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="hero-slider-container">
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
        >
          {/* Imagen de Fondo */}
          <img src={slide.image} alt={slide.title} className="hero-image" />
          
          {/* Overlay Oscuro */}
          <div className="hero-overlay"></div>

          {/* Contenido */}
          <div className="hero-content-wrapper">
            <div className="hero-content-inner">
              <span className="hero-tag">{slide.tag}</span>
              <h1 className="hero-title">
                {slide.title} <span className="highlight">{slide.titleSpan}</span>
              </h1>
              <p className="hero-description">{slide.desc}</p>
              
              <div className="hero-buttons">
                <Link to={slide.ctaLink} className="btn-hero-primary">
                  <ShoppingBag size={20} />
                  {slide.ctaText}
                </Link>
                <Link to={slide.secondaryLink} className="btn-hero-outline">
                  {slide.secondaryText} <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Flechas de Navegación */}
      <button 
        className="hero-nav-btn hero-prev" 
        onClick={prevSlide}
        aria-label="Anterior"
      >
        <ChevronLeft size={28} />
      </button>
      <button 
        className="hero-nav-btn hero-next" 
        onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
        aria-label="Siguiente"
      >
        <ChevronRight size={28} />
      </button>

      {/* Indicadores (Dots) */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => { setCurrentSlide(index); setIsAutoPlaying(false); }}
            role="button"
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
};

export default HeroBanner;