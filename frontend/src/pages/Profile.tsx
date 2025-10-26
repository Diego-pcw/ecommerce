import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import authService from "../services/auth.service";
import { useToast } from "../context/ToastContext";
import "../styles/users.shared.css";

const Profile: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const { push } = useToast();

  const [name, setName] = useState(user?.name ?? (user as any)?.name ?? "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile({
        name,
        password: password || undefined,
        password_confirmation: passwordConfirmation || undefined,
      } as any);
      push("✅ Perfil actualizado correctamente", "success");
      await refreshProfile();
    } catch (err: any) {
      push(err?.response?.data?.message ?? "❌ Error al actualizar el perfil", "error");
    } finally {
      setSaving(false);
      setPassword("");
      setPasswordConfirmation("");
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
            <strong>Fecha de registro:</strong>{" "}
            <span>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "No disponible"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-form">
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
            <span>Nueva contraseña (opcional)</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
            />
          </label>

          <label>
            <span>Confirmar contraseña</span>
            <input
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
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
