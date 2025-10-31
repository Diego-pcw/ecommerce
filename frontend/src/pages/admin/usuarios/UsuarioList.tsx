import React, { useEffect, useState } from "react";
import authService from "../../../services/auth.service";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";
import type { User } from "../../../types/User";
//import "../../../styles/admin.shared.css";

const UsuarioList: React.FC = () => {
  const { user } = useAuth();
  const { push } = useToast();

  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [buscar, setBuscar] = useState("");
  const [rol, setRol] = useState<"admin" | "cliente" | "">("");
  const [estado, setEstado] = useState<"activo" | "inactivo" | "">("");
  const [loading, setLoading] = useState(false);

  /** 🔹 Cargar usuarios */
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await authService.getUsuarios({
        buscar,
        rol: rol || undefined,
        estado: estado || undefined,
        per_page: 10,
      });
      setUsuarios(res.usuarios);
    } catch (err: any) {
      push(err?.response?.data?.message ?? "Error al cargar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Cambiar estado (activo/inactivo) */
  const handleCambiarEstado = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas cambiar el estado de este usuario?")) return;
    try {
      await authService.cambiarEstadoUsuario(id);
      push("Estado actualizado correctamente", "success");
      fetchUsuarios();
    } catch (err: any) {
      push(err?.response?.data?.message ?? "Error al cambiar estado", "error");
    }
  };

  useEffect(() => {
    if (user?.rol === "admin") fetchUsuarios();
  }, [rol, estado]);

  if (user?.rol !== "admin") {
    return (
      <div className="auth-container">
        <h3>Acceso denegado 🚫</h3>
        <p>No tienes permisos para ver esta sección.</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Gestión de Usuarios</h2>

      {/* 🔍 Filtros */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <select value={rol} onChange={(e) => setRol(e.target.value as any)}>
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="cliente">Cliente</option>
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value as any)}>
          <option value="">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
        <button onClick={fetchUsuarios} disabled={loading}>
          {loading ? "Cargando..." : "Buscar"}
        </button>
      </div>

      {/* 📋 Tabla de usuarios */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>
                  <span className={`status-badge ${u.estado === "activo" ? "active" : "inactive"}`}>
                    {u.estado}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-small"
                    onClick={() => handleCambiarEstado(u.id!)}
                    disabled={loading}
                  >
                    Cambiar estado
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No se encontraron usuarios.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsuarioList;