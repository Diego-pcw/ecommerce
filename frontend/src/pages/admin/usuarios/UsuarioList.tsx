import React, { useEffect, useState } from 'react';
import authService from '../../../services/auth.service.ts';
import { useToast } from '../../../context/ToastContext.tsx';
import { useAuth } from '../../../context/AuthContext.tsx';
import type { User } from '../../../types/User.ts';
import {
  Loader2,
  Search,
  Users,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
} from 'lucide-react';
import '../../../styles/admin/admin.shared.css'; // Ruta actualizada

const UsuarioList: React.FC = () => {
  const { user } = useAuth();
  const { push } = useToast();

  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [buscar, setBuscar] = useState('');
  const [rol, setRol] = useState<'admin' | 'cliente' | ''>('');
  const [estado, setEstado] = useState<'activo' | 'inactivo' | ''>('');
  const [loading, setLoading] = useState(false);

  /** 🔹 Cargar usuarios */
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await authService.getUsuarios({
        buscar,
        rol: rol || undefined,
        estado: estado || undefined,
        per_page: 10, // Tu lógica original
      });
      setUsuarios(res.usuarios);
    } catch (err: any) {
      push(err?.response?.data?.message ?? 'Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Cambiar estado (activo/inactivo) */
  const handleCambiarEstado = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas cambiar el estado de este usuario?'))
      return;
    try {
      await authService.cambiarEstadoUsuario(id);
      push('Estado actualizado correctamente', 'success');
      fetchUsuarios();
    } catch (err: any) {
      push(err?.response?.data?.message ?? 'Error al cambiar estado', 'error');
    }
  };

  useEffect(() => {
    if (user?.rol === 'admin') {
      fetchUsuarios();
      document.title = 'Gestión de Usuarios | Panel';
    }
  }, [rol, estado]); // Tu lógica original de recarga

  if (user?.rol !== 'admin') {
    return (
      <div className="access-denied-container">
        <h3>
          <ShieldAlert size={32} />
          Acceso denegado
        </h3>
        <p>No tienes permisos para ver esta sección.</p>
      </div>
    );
  }

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2 className="admin-list-title">Gestión de Usuarios</h2>
      </div>

      {/* 🔍 Filtros */}
      <div className="admin-filter-bar">
        <input
          type="search"
          placeholder="Buscar por nombre o correo..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchUsuarios()} // Buscar al presionar Enter
        />
        <select value={rol} onChange={(e) => setRol(e.target.value as any)}>
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="cliente">Cliente</option>
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value as any)}>
          <option value="">Todos los estados</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
        <button
          onClick={fetchUsuarios}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} />
          )}
          Buscar
        </button>
      </div>

      {/* 📋 Tabla de usuarios */}
      <div className="admin-table-wrapper">
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
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div className="loader-container" style={{ padding: '2rem' }}>
                    <Loader2 className="animate-spin" size={24} />
                    Cargando...
                  </div>
                </td>
              </tr>
            ) : usuarios.length > 0 ? (
              usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.rol}</td>
                  <td>
                    <span className={`status-badge ${u.estado}`}>
                      {u.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleCambiarEstado(u.id!)}
                      disabled={loading}
                      title={
                        u.estado === 'activo'
                          ? 'Desactivar usuario'
                          : 'Activar usuario'
                      }
                    >
                      {u.estado === 'activo' ? (
                        <ToggleLeft size={16} />
                      ) : (
                        <ToggleRight size={16} />
                      )}
                      {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <p className="admin-list-empty" style={{ padding: '2rem' }}>
                    <Users size={32} />
                    No se encontraron usuarios.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuarioList;