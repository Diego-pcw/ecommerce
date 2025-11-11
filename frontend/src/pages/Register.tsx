import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { useToast } from '../context/ToastContext';
import { UserPlus, Loader2, KeyRound, Mail, User } from 'lucide-react';
import '../styles/users/user.shared.css';

const Register: React.FC = () => {
  const { push } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      push('Las contraseñas no coinciden', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await authService.register(form);
      push('Registro exitoso 🎉 ¡Bienvenido!', 'success');
      navigate('/', { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? 'Error al registrar el usuario.';
      push(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="user-auth-container">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-form-header">
          <UserPlus size={32} />
          <h2>Crear cuenta</h2>
        </div>

        <div className="admin-form-group">
          <label htmlFor="name">
            <User size={16} />
            Nombre completo
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Tu nombre"
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="email">
            <Mail size={16} />
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="password">
            <KeyRound size={16} />
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="password_confirmation">
            <KeyRound size={16} />
            Confirmar contraseña
          </label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            type="password"
            placeholder="Repite tu contraseña"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <UserPlus size={18} />
          )}
          {submitting ? 'Registrando...' : 'Registrarme'}
        </button>

        <p className="auth-footer-link">
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;