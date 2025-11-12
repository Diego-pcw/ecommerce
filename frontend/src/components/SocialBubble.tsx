import React, { useState, useEffect } from 'react';
import { MessageSquare, Facebook, Instagram, X } from 'lucide-react';
import '../styles/layout.shared.css';

const SocialBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const toggle = () => setIsOpen((prev) => !prev);

  const whatsappLink = 'https://wa.me/51987654321';
  const facebookLink = 'https://facebook.com/tutienda';
  const instagramLink = 'https://instagram.com/tutienda';

  return (
    <div className="social-bubble-container">
      <div className={`social-bubble-menu ${isOpen ? 'open' : 'closed'}`}>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="social-bubble-link whatsapp">
          <MessageSquare />
        </a>
        <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="social-bubble-link facebook">
          <Facebook />
        </a>
        <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="social-bubble-link instagram">
          <Instagram />
        </a>
      </div>

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