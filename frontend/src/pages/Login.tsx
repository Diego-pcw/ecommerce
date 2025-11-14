import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Loader2, KeyRound, Mail } from 'lucide-react';
import '../styles/users/user.shared.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const { push } = useToast();


  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      push('Por favor, complete todos los campos.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await login(form.email, form.password);
      push('Inicio de sesión exitoso ✅', 'success');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        'Credenciales inválidas. Verifique sus datos.';
      push(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="user-auth-container">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-form-header">
          <LogIn size={32} />
          <h2>Iniciar sesión</h2>
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
            autoComplete="email"
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
            placeholder="••••••••"
            required
            autoComplete="current-password"
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
            <LogIn size={18} />
          )}
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="auth-footer-link">
          <Link to="/register">¿No tienes cuenta? Regístrate</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;