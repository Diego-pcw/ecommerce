import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/users.shared.css";

const Login: React.FC = () => {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      push("Inicio de sesión exitoso", "success");
      navigate("/", { replace: true });
    } catch (err: any) {
      push(err?.response?.data?.message ?? "Credenciales inválidas", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit" disabled={submitting}>
          {submitting ? "Ingresando..." : "Ingresar"}
        </button>

        <p style={{ textAlign: "right" }}>
          <Link to="/register">¿No tienes cuenta? Regístrate</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
