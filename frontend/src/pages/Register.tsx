import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { useToast } from "../context/ToastContext";
import "../styles/users.shared.css";

const Register: React.FC = () => {
  const { push } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      push("Las contraseñas no coinciden", "error");
      return;
    }

    setSubmitting(true);
    try {
      await authService.register(form);
      push("Registro exitoso 🎉 Bienvenido!", "success");
      navigate("/", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Error al registrar el usuario.";
      push(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          <span>Nombre completo</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Tu nombre"
            required
          />
        </label>

        <label>
          <span>Correo electrónico</span>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="ejemplo@correo.com"
            required
          />
        </label>

        <label>
          <span>Contraseña</span>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </label>

        <label>
          <span>Confirmar contraseña</span>
          <input
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            type="password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="btn-submit"
        >
          {submitting ? "Registrando..." : "Registrarme"}
        </button>

        <p className="auth-footer">
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
