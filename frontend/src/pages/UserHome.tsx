import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import MarcasDestacadas from '../components/home/MarcasDestacadas';
import CategoriasDestacadas from '../components/home/CategoriasDestacadas';
import ProductosDestacados from '../components/home/ProductosDestacados';
import PromocionesDestacadas from '../components/home/PromocionesDestacadas';
import ResenasDestacadas from '../components/home/ResenasDestacadas';
import ContactForm from '../components/contactos/ContactForm';

import '../styles/home.shared.css';

const UserHome: React.FC = () => {
  return (
    <div className="home-wrapper">
      <HeroBanner />
      
      <section className="home-section">
        <PromocionesDestacadas />
      </section>

      <section className="home-section">
        <ProductosDestacados />
      </section>

      <section className="home-section" style={{backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)'}}>
        <CategoriasDestacadas />
      </section>

      <section className="home-section brands-section">
        <MarcasDestacadas />
      </section>

      {/* Reseñas y Contacto ya tienen sus propios contenedores y padding */}
      <ResenasDestacadas />
      <ContactForm />
    </div>
  );
};

export default UserHome;