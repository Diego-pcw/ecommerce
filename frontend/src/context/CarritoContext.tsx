import { createContext, useContext } from "react";
import { useCarrito } from "../hooks/useCarrito";
import type { ReactNode } from "react";

interface CarritoProviderProps {
  children: ReactNode;
}

// 🧩 Crear contexto
const CarritoContext = createContext<ReturnType<typeof useCarrito> | null>(null);

// 🏪 Proveedor global del carrito
export const CarritoProvider = ({ children }: CarritoProviderProps) => {
  const carrito = useCarrito();

  return (
    <CarritoContext.Provider value={carrito}>
      {children}
    </CarritoContext.Provider>
  );
};

// 🎯 Hook para consumir el contexto del carrito
export const useCarritoContext = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarritoContext debe usarse dentro de un CarritoProvider.");
  }
  return context;
};

export default CarritoContext;
