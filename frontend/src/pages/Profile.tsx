import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth.service';
import { useToast } from '../context/ToastContext';
import {
  User,
  Mail,
  KeyRound,
  CheckCircle,
  CalendarDays,
  Save,
  Loader2,
  Shield,
} from 'lucide-react';
import '../styles/users/user.shared.css';

const Profile: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const { push } = useToast();

  const [form, setForm] = useState({
    name: user?.name ?? '',
    password: '',
    password_confirmation: '',
  });

  const [saving, setSaving] = useState(false);

  // ✅ Mantener sincronizado el formulario con el perfil actual
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.name ?? '',
    }));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password && form.password !== form.password_confirmation) {
      push('Las contraseñas no coinciden', 'error');
      return;
    }

    setSaving(true);
    try {
      await authService.updateProfile({
        name: form.name.trim(),
        password: form.password || undefined,
        password_confirmation: form.password_confirmation || undefined,
      });

      push('✅ Perfil actualizado correctamente', 'success');

      await refreshProfile();

      // 🔄 Limpiar contraseñas sin tocar el nombre
      setForm((prev) => ({
        ...prev,
        password: '',
        password_confirmation: '',
      }));
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? '❌ Error al actualizar el perfil.';
      push(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-header">Mi Perfil</h2>

      <div className="profile-card">
        <div className="profile-info-display">
          <div className="profile-info-item">
            <strong>
              <Mail size={14} /> Email
            </strong>
            <span>{user?.email ?? 'No disponible'}</span>
          </div>

          <div className="profile-info-item">
            <strong>
              <Shield size={14} /> Rol
            </strong>
            <span style={{ textTransform: 'capitalize' }}>
              {user?.rol ?? 'Usuario'}
            </span>
          </div>

          <div className="profile-info-item">
            <strong>
              <CheckCircle size={14} /> Estado
            </strong>
            <span
              className={`status-badge ${
                user?.estado === 'activo' ? 'activo' : 'inactivo'
              }`}
            >
              {user?.estado ?? 'activo'}
            </span>
          </div>

          <div className="profile-info-item">
            <strong>
              <CalendarDays size={14} /> Registrado el
            </strong>
            <span>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('es-PE')
                : 'No disponible'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-form" noValidate>
          <div className="admin-form-group">
            <label htmlFor="name">
              <User size={16} />
              Nombre
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">
              <KeyRound size={16} />
              Nueva contraseña (opcional)
            </label>
            <input
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
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
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
