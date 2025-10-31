import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/users.shared.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      push("Por favor, complete todos los campos.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await login(form.email, form.password);
      push("Inicio de sesión exitoso ✅", "success");
      navigate("/", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Credenciales inválidas. Verifique sus datos.";
      push(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          <span>Correo</span>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="ejemplo@correo.com"
            required
            autoComplete="email"
          />
        </label>

        <label>
          <span>Contraseña</span>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="btn-submit"
        >
          {submitting ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="auth-footer">
          <Link to="/register">¿No tienes cuenta? Regístrate</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
