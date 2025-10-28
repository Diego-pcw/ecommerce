import { type Categoria } from "./Categoria";
import { type ImagenProducto } from "./ImagenProducto";
import { type DataResponse, type Paginated } from "./Common";

/* -------------------------------------------
 * 🔹 Promoción vigente (accessor del modelo)
 * ----------------------------------------- */
export interface PromocionVigente {
  titulo: string;
  tipo: "percent" | "fixed";
  valor: number;
  fecha_inicio: string;
  fecha_fin: string;
}

/* -------------------------------------------
 * 🔹 Imagen simplificada (para listados)
 * ----------------------------------------- */
export interface ProductoImagen {
  id: number;
  url: string;
  principal: boolean;
}

/* -------------------------------------------
 * 🔹 Modelo completo del producto
 * ----------------------------------------- */
export interface Producto {
  id: number;
  categoria_id?: number;
  nombre: string;
  slug?: string;
  marca?: string | null;
  descripcion?: string | null;
  precio_original: string;
  precio_final: number;
  stock: number;
  estado?: "activo" | "inactivo";
  deleted_at?: string | null;

  categoria?: Categoria;
  imagenes?: ImagenProducto[];

  promocion_vigente?: PromocionVigente | null;

  created_at?: string;
  updated_at?: string;
}

/* -------------------------------------------
 * 🔹 Vista simplificada para listados públicos
 * ----------------------------------------- */
export interface ProductoListItem {
  id: number;
  nombre: string;
  marca?: string | null;
  descripcion?: string | null;
  categoria: string;
  precio_original: string;
  precio_final: number;
  stock: number;
  promocion_vigente: PromocionVigente | null;
  imagenes: ProductoImagen[];
}

/* -------------------------------------------
 * ✏️ Datos de creación / actualización
 * ----------------------------------------- */
export interface ProductoCreateData {
  nombre: string;
  marca?: string | null;
  descripcion?: string | null;
  precio: number;
  stock: number;
  categoria_id: number;
  estado?: "activo" | "inactivo";
}

export interface ProductoUpdateData {
  nombre?: string;
  marca?: string | null;
  descripcion?: string | null;
  precio?: number;
  stock?: number;
  categoria_id?: number;
  estado?: "activo" | "inactivo";
}

/* -------------------------------------------
 * 🧾 Respuestas de la API
 * ----------------------------------------- */
export interface ProductoResponse {
  message: string;
  producto: Producto;
}

export interface ProductoListResponse extends Paginated<ProductoListItem> {}

export type ProductosOfertasResponse = ProductoListItem[];
