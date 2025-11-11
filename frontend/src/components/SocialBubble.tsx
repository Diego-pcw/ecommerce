import React, { useState } from 'react';
import { MessageSquare, Facebook, Instagram, X } from 'lucide-react';
import '../styles/layout.shared.css'; // Reutilizamos el CSS del layout

const SocialBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  // NOTA: Reemplaza '#' con tus enlaces reales
  const whatsappLink = 'https://wa.me/51987654321'; // Ejemplo: +51 987654321
  const facebookLink = 'https://facebook.com/tutienda';
  const instagramLink = 'https://instagram.com/tutienda';

  return (
    <div className="social-bubble-container">
      {/* Menú de enlaces */}
      <div className={`social-bubble-menu ${isOpen ? 'open' : 'closed'}`}>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="social-bubble-link whatsapp"
          aria-label="Contactar por WhatsApp"
        >
          <MessageSquare />
        </a>
        <a
          href={facebookLink}
          target="_blank"
          rel="noopener noreferrer"
          className="social-bubble-link facebook"
          aria-label="Ir a Facebook"
        >
          <Facebook />
        </a>
        <a
          href={instagramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="social-bubble-link instagram"
          aria-label="Ir a Instagram"
        >
          <Instagram />
        </a>
        {/* Puedes añadir TikTok aquí si encuentras un icono SVG o de otra librería */}
      </div>

      {/* Botón principal para abrir/cerrar */}
      <button
        className={`social-bubble-toggle ${isOpen ? 'open' : 'closed'}`}
        onClick={toggle}
        aria-label="Abrir menú de contacto"
      >
        <MessageSquare className="icon-open" size={30} />
        <X className="icon-close" size={30} />
      </button>
    </div>
  );
};

export default SocialBubble;