import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { promocionService } from '../../services/promocion.service';
import type { Promocion } from '../../types/Promocion';
import {
  Loader2,
  Sparkles,
  CalendarClock,
  AlarmClock,
  ArrowRight,
} from 'lucide-react';
import '../../styles/promociones/promocionmix.shared.css';

// Imágenes de fallback de alta calidad por si la promo no tiene productos
const FALLBACK_IMAGES = {
  new: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', // Moto moderna
  coming: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80', // Casco artístico
  ending: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', // Velocímetro
};

const PromocionMix: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [mix, setMix] = useState<{
    nuevo: Promocion | null;
    futuro: Promocion | null;
    vence: Promocion | null;
  }>({ nuevo: null, futuro: null, vence: null });

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await promocionService.listar();
        const todas = res.data || [];
        const hoy = new Date();

        // 1. Lógica para "Recién Llegado" (La más reciente activa)
        // Ordenamos por fecha de inicio descendente
        const nuevas = todas
          .filter(
            (p: Promocion) =>
              new Date(p.fecha_inicio) <= hoy && new Date(p.fecha_fin) >= hoy
          )
          .sort(
            (a: Promocion, b: Promocion) =>
              new Date(b.fecha_inicio).getTime() -
              new Date(a.fecha_inicio).getTime()
          );

        // 2. Lógica para "Por Venir" (Fecha inicio > hoy)
        const futuras = todas
          .filter((p: Promocion) => new Date(p.fecha_inicio) > hoy)
          .sort(
            (a: Promocion, b: Promocion) =>
              new Date(a.fecha_inicio).getTime() -
              new Date(b.fecha_inicio).getTime()
          );

        // 3. Lógica para "Por Vencer" (Activa, fecha fin más cercana)
        const porVencer = todas
          .filter(
            (p: Promocion) =>
              new Date(p.fecha_inicio) <= hoy && new Date(p.fecha_fin) >= hoy
          )
          .sort(
            (a: Promocion, b: Promocion) =>
              new Date(a.fecha_fin).getTime() - new Date(b.fecha_fin).getTime()
          );

        // Seleccionamos 3 promociones DISTINTAS si es posible
        const selectedNew = nuevas[0] || null;
        // Evitamos repetir la misma promo en "Por Vencer" si ya está en "Nueva"
        const selectedEnding =
          porVencer.find((p: Promocion) => p.id !== selectedNew?.id) ||
          porVencer[0] ||
          null;
        const selectedFuture = futuras[0] || null;

        setMix({
          nuevo: selectedNew,
          futuro: selectedFuture,
          vence: selectedEnding,
        });
      } catch (error) {
        console.error('Error al cargar mix de promociones', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  // Helper para obtener imagen (Del producto o Fallback)
  const getImage = (promo: Promocion | null, type: 'new' | 'coming' | 'ending') => {
    if (promo?.productos && promo.productos.length > 0 && promo.productos[0].imagenes && promo.productos[0].imagenes.length > 0) {
      return promo.productos[0].imagenes[0].url;
    }
    return FALLBACK_IMAGES[type];
  };

  if (loading) {
    return (
      <div className="promo-loader">
        <Loader2 className="animate-spin" size={48} color="#888" />
      </div>
    );
  }

  // Si no hay ninguna promoción, no mostramos la sección
  if (!mix.nuevo && !mix.futuro && !mix.vence) return null;

  return (
    <section className="promo-mix-section">
      <div className="promo-mix-container">
        <div className="promo-mix-header">
          <h2 className="promo-mix-title">
            Oportunidades <span>Imperdibles</span>
          </h2>
        </div>

        <div className="promo-mix-grid">
          {/* TARJETA 1: NUEVO (FRESH) */}
          {mix.nuevo && (
            <div className="promo-card-mix style-new">
              <img
                src={getImage(mix.nuevo, 'new')}
                alt={mix.nuevo.titulo}
                className="promo-bg-image"
              />
              <div className="promo-overlay" />
              
              <div className="promo-tag-top">
                <Sparkles size={16} /> Recién Llegado
              </div>

              <div className="promo-content">
                <div className="promo-discount-big">
                  {mix.nuevo.descuento_tipo === 'percent'
                    ? mix.nuevo.descuento_valor
                    : 'S/' + Number(mix.nuevo.descuento_valor).toFixed(0)}
                  <sub>{mix.nuevo.descuento_tipo === 'percent' ? '% OFF' : 'DSCTO'}</sub>
                </div>
                <h3 className="promo-name">{mix.nuevo.titulo}</h3>
                <p style={{opacity: 0.9, marginBottom: '1.5rem', fontSize: '0.9rem'}}>
                  {mix.nuevo.descripcion || 'Descubre lo último en nuestra tienda.'}
                </p>
                
                <Link to={`/promociones/${mix.nuevo.id}`} className="btn-promo-action">
                  Ver Oferta <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}

          {/* TARJETA 2: FUTURO (HYPE) */}
          {mix.futuro ? (
            <div className="promo-card-mix style-coming">
              <img
                src={getImage(mix.futuro, 'coming')}
                alt={mix.futuro.titulo}
                className="promo-bg-image"
              />
              <div className="promo-overlay" />
              
              <div className="promo-tag-top">
                <CalendarClock size={16} /> Próximamente
              </div>

              <div className="promo-content">
                <div className="promo-name" style={{fontSize: '2rem', marginBottom: '1rem'}}>
                  {mix.futuro.titulo}
                </div>
                <div className="promo-timer">
                  Empieza el: {new Date(mix.futuro.fecha_inicio).toLocaleDateString()}
                </div>
                <p style={{opacity: 0.9, marginBottom: '1.5rem'}}>
                  Prepárate para lo que viene. ¡No te lo pierdas!
                </p>
                
                <button className="btn-promo-action" disabled style={{opacity: 0.8, cursor: 'default'}}>
                  Muy Pronto...
                </button>
              </div>
            </div>
          ) : (
            /* Fallback si no hay promo futura: Relleno estético */
            <div className="promo-card-mix style-coming">
               <img src="https://plus.unsplash.com/premium_photo-1744395627552-1349f5d80199?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="promo-bg-image" alt="Biker" />
               <div className="promo-overlay" />
               <div className="promo-content">
                 <h3 className="promo-name">Unete al Club</h3>
                 <p>Recibe noticias exclusivas antes que nadie.</p>
                 <Link to="/register" className="btn-promo-action">Registrarse</Link>
               </div>
            </div>
          )}

          {/* TARJETA 3: POR VENCER (URGENCY) */}
          {mix.vence && (
            <div className="promo-card-mix style-ending">
              <img
                src={getImage(mix.vence, 'ending')}
                alt={mix.vence.titulo}
                className="promo-bg-image"
              />
              <div className="promo-overlay" />
              
              <div className="promo-tag-top">
                <AlarmClock size={16} /> Última Oportunidad
              </div>

              <div className="promo-content">
                 <div className="promo-discount-big">
                  {mix.vence.descuento_tipo === 'percent'
                    ? mix.vence.descuento_valor
                    : 'S/' + Number(mix.vence.descuento_valor).toFixed(0)}
                  <sub>{mix.vence.descuento_tipo === 'percent' ? '% OFF' : 'DSCTO'}</sub>
                </div>
                
                <div className="promo-timer" style={{color: '#ffcdd2', borderColor: '#ef5350'}}>
                  Expira: {new Date(mix.vence.fecha_fin).toLocaleDateString()}
                </div>

                <Link to={`/promociones/${mix.vence.id}`} className="btn-promo-action">
                  Aprovechar Ahora <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromocionMix;