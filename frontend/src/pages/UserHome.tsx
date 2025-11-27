import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import MarcasDestacadas from '../components/home/MarcasDestacadas';
import CategoriasDestacadas from '../components/home/CategoriasDestacadas';
import ProductosDestacados from '../components/home/ProductosDestacados';
import ProductosMix from '../components/home/ProductosMix';
import PromocionMix from '../components/home/PromocionMix';
import SobreNosotros from '../components/home/SobreNosotros';
import ResenasDestacadas from '../components/home/ResenasDestacadas';
import ContactForm from '../components/contactos/ContactForm';

import '../styles/home.shared.css';

const UserHome: React.FC = () => {
  return (
    <div className="home-wrapper">
      <HeroBanner />

      <section className="home-section">
        <PromocionMix />
      </section>
      
      <section className="home-section">
        <ProductosDestacados />
      </section>

      <section className="home-section">
        <ProductosMix />
      </section>

      <section className="home-section" style={{backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)'}}>
        <CategoriasDestacadas />
      </section>

      <section className="home-section brands-section">
        <MarcasDestacadas />
      </section>

      {/* Reseñas y Contacto ya tienen sus propios contenedores y padding */}
      <section className="home-section brands-section">
        <ResenasDestacadas />
      </section>

      <section className="home-section">
        <SobreNosotros />
      </section>

      <section className="home-section brands-section">
        <ContactForm />
      </section>
      

    </div>
  );
};

export default UserHome;