import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { useToast } from "../context/ToastContext";
import "../styles/users.shared.css";

const Register: React.FC = () => {
  const { push } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authService.register({
        name, 
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      push("Registro exitoso. Bienvenido!", "success");
      navigate("/", { replace: true });
    } catch (err: any) {
      push(err?.response?.data?.message ?? "Error al registrar", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
          />
        </label>

        <label>
          <span>Correo</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>

        <label>
          <span>Contraseña</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>

        <label>
          <span>Confirmar contraseña</span>
          <input
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            type="password"
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Registrando..." : "Registrarme"}
        </button>

        <p style={{ textAlign: "right" }}>
          <Link to="/login">¿Ya tienes cuenta? Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
