// src/pages/Profile.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import authService from "../services/auth.service";
import { useToast } from "../context/ToastContext";

const Profile: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const { push } = useToast();

  const [name, setName] = useState(user?.nombre ?? (user as any)?.name ?? "");
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
      push("Perfil actualizado", "success");
      await refreshProfile();
    } catch (err: any) {
      push(err?.response?.data?.message ?? "Error al actualizar", "error");
    } finally {
      setSaving(false);
      setPassword("");
      setPasswordConfirmation("");
    }
  };

  return (
    <div className="max-w-lg mx-auto border rounded p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Mi perfil</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <label className="block">
          <span className="text-sm">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm">Nueva contraseña (opcional)</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm">Confirmar contraseña</span>
          <input
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            type="password"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
