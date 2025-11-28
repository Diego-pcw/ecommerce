// 🏍️ src/pages/UserHome.tsx
// Página Principal de Biker Wolf - Diseño Premium E-commerce

import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import MarcasDestacadas from '../components/home/MarcasDestacadas';
import CategoriasDestacadas from '../components/home/CategoriasDestacadas';
import ProductosDestacados from '../components/home/ProductosDestacados';
import ProductosMix from '../components/home/ProductosMix';
import PromocionMix from '../components/home/PromocionMix';
import ServiciosDestacados from '../components/home/ServiciosDestacados';
import SobreNosotros from '../components/home/SobreNosotros';
import ResenasDestacadas from '../components/home/ResenasDestacadas';
import ContactForm from '../components/contactos/ContactForm';

// Estilos premium mejorados
import '../styles/home.shared.css';

const UserHome: React.FC = () => {
  return (
    <div className="home-wrapper">
      
      {/* ============================================ */}
      {/* 🎬 HERO BANNER - Primera Impresión */}
      {/* ============================================ */}
      <section className="hero-section">
        <HeroBanner />
      </section>

      {/* ============================================ */}
      {/* 🔥 PROMOCIONES DESTACADAS - Urgencia Visual */}
      {/* ============================================ */}
      <section className="home-section promo-section bg-accent-gradient">
        <div className="section-container">
          <h2 className="home-section-title animate-in-left">
            ⚡ Ofertas <span>Explosivas</span> ⚡
          </h2>
          <PromocionMix />
        </div>
      </section>
      
      {/* ============================================ */}
      {/* ⭐ PRODUCTOS DESTACADOS - Top Ventas */}
      {/* ============================================ */}
      <section className="home-section products-section">
        <div className="section-container">
          <h2 className="home-section-title animate-in-right">
            🏆 Productos <span>Top</span> 🏆
          </h2>
          <ProductosDestacados />
        </div>
      </section>

      {/* ============================================ */}
      {/* 🆕 MIX DE PRODUCTOS - Novedades vs Ofertas */}
      {/* ============================================ */}
      <section className="home-section mix-section">
        <div className="section-container">
          <h2 className="home-section-title animate-in-left">
            🎯 Lo Mejor del <span>Catálogo</span>
          </h2>
          <ProductosMix />
        </div>
      </section>

      {/* ============================================ */}
      {/* 📂 CATEGORÍAS DESTACADAS - Navegación Visual */}
      {/* ============================================ */}
      <section 
        className="home-section categories-section card-hover-effect" 
        style={{
          backgroundColor: '#ffffff', 
          borderTop: '2px solid rgba(255, 215, 0, 0.2)', 
          borderBottom: '2px solid rgba(255, 215, 0, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="section-container">
          <h2 className="home-section-title">
            🗂️ Explora por <span>Categorías</span>
          </h2>
          <CategoriasDestacadas />
        </div>
      </section>

      <section className="home-section mix-section">
        <div className="section-container">
          <h2 className="home-section-title animate-in-left">
            🎯 Servicios a tu servicio <span>APROVECHA!</span>
          </h2>
          <ServiciosDestacados />
        </div>
      </section>

      {/* ============================================ */}
      {/* 🏷️ MARCAS DESTACADAS - Logos Premium */}
      {/* ============================================ */}
      <section className="home-section brands-section">
        <div className="section-container">
          <h2 className="home-section-title animate-in-right">
            🌟 Marcas <span>de Confianza</span>
          </h2>
          <MarcasDestacadas />
        </div>
      </section>

      {/* ============================================ */}
      {/* 💬 RESEÑAS DE CLIENTES - Social Proof */}
      {/* ============================================ */}
      <section className="home-section reviews-section bg-accent-gradient">
        <div className="section-container">
          <h2 className="home-section-title animate-in-left">
            ⭐ Lo que Dicen <span>Nuestros Clientes</span>
          </h2>
          <ResenasDestacadas />
        </div>
      </section>

      {/* ============================================ */}
      {/* 📖 SOBRE NOSOTROS - Historia y Valores */}
      {/* ============================================ */}
      <section 
        className="home-section about-section" 
        style={{
          backgroundColor: '#fff',
          borderTop: '1px solid rgba(255, 215, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
        }}
      >
        <div className="section-container">
          <h2 className="home-section-title animate-in-right">
            🏍️ Conoce <span>Biker Wolf</span>
          </h2>
          <SobreNosotros />
        </div>
      </section>

      {/* ============================================ */}
      {/* 📧 FORMULARIO DE CONTACTO - CTA Final */}
      {/* ============================================ */}
      <section className="home-section contact-section brands-section">
        <div className="section-container">
          <h2 className="home-section-title animate-in-left">
            📞 ¿Tienes <span>Dudas?</span> Contáctanos
          </h2>
          <ContactForm />
        </div>
      </section>
      
    </div>
  );
};

export default UserHome;