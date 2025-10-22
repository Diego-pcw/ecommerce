// src/pages/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { useToast } from "../context/ToastContext";

const Register: React.FC = () => {
  const { push } = useToast();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authService.register({
        nombre,
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
    <div className="max-w-md mx-auto border rounded p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Crear cuenta</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Nombre</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            type="text"
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm">Correo</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm">Contraseña</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm">Confirmar contraseña</span>
          <input
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            type="password"
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {submitting ? "Registrando..." : "Registrarme"}
          </button>

          <Link to="/login" className="text-sm text-blue-600">
            ¿Ya tienes cuenta? Ingresar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
