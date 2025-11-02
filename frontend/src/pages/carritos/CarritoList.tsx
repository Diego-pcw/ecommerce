// src/pages/carritos/CarritoList.tsx
import React, { useEffect, useState } from "react";
import carritoService from "../../services/carrito.service";
import { type Carrito } from "../../types/Carrito";
import { useToast } from "../../context/ToastContext";

const CarritoList: React.FC = () => {
  const { push } = useToast();
  const [carritos, setCarritos] = useState<Carrito[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarritos = async () => {
    try {
      const res = await carritoService.listar();
      setCarritos(res.carritos.data);
    } catch {
      push("❌ Error al cargar los carritos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarritos();
  }, []);

  if (loading) return <p>Cargando carritos...</p>;

  return (
    <div className="carrito-list-container">
      <h2>🛒 Lista de Carritos</h2>
      {carritos.length === 0 ? (
        <p>No hay carritos registrados.</p>
      ) : (
        <table className="carrito-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carritos.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.usuario?.name ?? "Invitado"}</td>
                <td>
                  <span
                    className={`badge ${
                      c.estado === "activo" ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {c.estado}
                  </span>
                </td>
                <td>S/ {c.total?.toFixed(2) ?? "0.00"}</td>
                <td>{new Date(c.created_at ?? "").toLocaleDateString()}</td>
                <td>
                  <a href={`/carritos/${c.id}`} className="btn btn-primary btn-sm">
                    Ver detalles
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CarritoList;
