import React, { useState } from "react";

const FormularioContacto: React.FC = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Gracias, ${form.nombre}. Tu mensaje ha sido enviado.`);
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <section className="contacto-section">
      <h2 className="section-title">📞 ¿Tienes dudas? Contáctanos</h2>
      <form className="contacto-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Tu nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Tu correo"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="mensaje"
          placeholder="Escribe tu mensaje..."
          value={form.mensaje}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-home-primary">
          Enviar mensaje
        </button>
      </form>
    </section>
  );
};

export default FormularioContacto;
