import api from "./api";
import { type AxiosResponse } from "axios";

/* -------------------------------------------
 * 🧩 Interfaces principales
 * ----------------------------------------- */
export interface ImagenProducto {
  id: number;
  producto_id: number;
  url: string;
  alt_text?: string;
  principal?: boolean;
  orden?: number;
  estado?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Promocion {
  id: number;
  titulo: string;
  descripcion?: string;
  descuento_valor: number;
  tipo_descuento?: "porcentaje" | "fijo";
  fecha_inicio: string;
  fecha_fin: string;
  estado?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_original: number;
  precio_final?: number;
  stock: number;
  categoria?: string;
  promocion_vigente?: string | null;
  imagenes?: ImagenProducto[];
  created_at?: string;
  updated_at?: string;
}

/* -------------------------------------------
 * ✏️ Estructuras de entrada
 * ----------------------------------------- */
export interface ProductoInput {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria_id: number;
  estado?: "activo" | "inactivo";
  sku?: string;
}

export interface PromocionInput {
  titulo: string;
  descripcion?: string;
  descuento_valor: number;
  tipo_descuento?: "porcentaje" | "fijo";
  fecha_inicio: string;
  fecha_fin: string;
  estado?: "activo" | "inactivo";
}

/* -------------------------------------------
 * ⚙️ Servicio centralizado de productos
 * ----------------------------------------- */
class ProductoService {
  /* 🔹 Obtener todos los productos */
  async obtenerTodos(params?: {
    search?: string;
    categoria_id?: number;
    precio_min?: number;
    precio_max?: number;
    estado?: string;
    sort_by?: string;
    sort_dir?: string;
    page?: number;
    per_page?: number;
  }): Promise<any> {
    const res: AxiosResponse = await api.get("/productos", { params });
    return res.data;
  }

  /* 🔹 Obtener producto por ID */
  async obtenerPorId(id: number): Promise<Producto> {
    const res: AxiosResponse<Producto> = await api.get(`/productos/${id}`);
    return res.data;
  }

  /* 🔹 Obtener productos con ofertas */
  async obtenerConOfertas(): Promise<Producto[]> {
    const res: AxiosResponse<Producto[]> = await api.get("/productos/ofertas");
    return res.data;
  }

/* 🔸 Crear producto (solo admin) */
async crear(producto: ProductoInput): Promise<Producto> {
  const token = localStorage.getItem("token"); // o sessionStorage según tu login
  const res: AxiosResponse<Producto> = await api.post("/productos", producto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/* 🔸 Actualizar producto (solo admin) */
async actualizar(id: number, producto: Partial<ProductoInput>): Promise<Producto> {
  const token = localStorage.getItem("token");
  const res: AxiosResponse<Producto> = await api.put(`/productos/${id}`, producto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

  /* 🔸 Eliminar producto (solo admin) */
  async eliminar(id: number): Promise<void> {
    await api.delete(`/productos/${id}`);
  }

  /* -------------------------------------------
   * 🖼️ Gestión de imágenes
   * ----------------------------------------- */
  async obtenerImagenesPorProducto(productoId: number): Promise<any> {
    const res: AxiosResponse = await api.get(`/imagenes/producto/${productoId}`);
    return res.data;
  }

  async listarImagenes(): Promise<any> {
    const res: AxiosResponse = await api.get("/imagenes");
    return res.data;
  }

  async subirImagen(formData: FormData): Promise<ImagenProducto> {
    const res: AxiosResponse<ImagenProducto> = await api.post("/imagenes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  async actualizarImagen(id: number, formData: FormData): Promise<ImagenProducto> {
    const res: AxiosResponse<ImagenProducto> = await api.post(`/imagenes/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  async eliminarImagen(id: number): Promise<void> {
    await api.delete(`/imagenes/${id}`);
  }

  /* -------------------------------------------
   * 🎯 Gestión de promociones
   * ----------------------------------------- */
  async obtenerPromociones(params?: {
    estado?: string;
    vigente?: boolean;
    search?: string;
    sort?: string;
    page?: number;
    per_page?: number;
  }): Promise<any> {
    const res: AxiosResponse = await api.get("/promociones", { params });
    return res.data;
  }

  async obtenerPromocionPorId(id: number): Promise<Promocion> {
    const res: AxiosResponse<Promocion> = await api.get(`/promociones/${id}`);
    return res.data;
  }

  async crearPromocion(data: PromocionInput): Promise<Promocion> {
    const res: AxiosResponse<Promocion> = await api.post("/promociones", data);
    return res.data;
  }

  async actualizarPromocion(id: number, data: Partial<PromocionInput>): Promise<Promocion> {
    const res: AxiosResponse<Promocion> = await api.put(`/promociones/${id}`, data);
    return res.data;
  }

  async eliminarPromocion(id: number): Promise<void> {
    await api.delete(`/promociones/${id}`);
  }

  async asignarProductosAPromocion(promocionId: number, productos: number[]): Promise<any> {
    const res: AxiosResponse = await api.post(`/promociones/${promocionId}/productos`, { productos });
    return res.data;
  }
}

export default new ProductoService();
