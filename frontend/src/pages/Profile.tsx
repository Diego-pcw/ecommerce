import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import authService from "../services/auth.service";
import { useToast } from "../context/ToastContext";
import "../styles/users.shared.css";

const Profile: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const { push } = useToast();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    password: "",
    password_confirmation: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password && form.password !== form.password_confirmation) {
      push("Las contraseñas no coinciden", "error");
      return;
    }

    setSaving(true);
    try {
      await authService.updateProfile({
        name: form.name.trim(),
        password: form.password || undefined,
        password_confirmation: form.password_confirmation || undefined,
      });
      push("✅ Perfil actualizado correctamente", "success");
      await refreshProfile();
      setForm((prev) => ({
        ...prev,
        password: "",
        password_confirmation: "",
      }));
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "❌ Error al actualizar el perfil.";
      push(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-container profile-page">
      <h2 className="profile-title">Mi Perfil</h2>

      <div className="profile-card">
        <div className="profile-info">
          <div className="info-item">
            <strong>Email:</strong> <span>{user?.email ?? "No disponible"}</span>
          </div>
          <div className="info-item">
            <strong>Rol:</strong> <span>{user?.rol ?? "Usuario"}</span>
          </div>
          <div className="info-item">
            <strong>Estado:</strong>{" "}
            <span
              className={`status-badge ${
                user?.estado === "activo" ? "active" : "inactive"
              }`}
            >
              {user?.estado ?? "activo"}
            </span>
          </div>
          <div className="info-item">
            <strong>Registrado el:</strong>{" "}
            <span>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "No disponible"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-form" noValidate>
          <label>
            <span>Nombre</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              required
            />
          </label>

          <label>
            <span>Nueva contraseña (opcional)</span>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
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
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
