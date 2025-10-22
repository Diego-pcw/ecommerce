// src/pages/UserHome.tsx
import React from "react";
import { Link } from "react-router-dom";

const UserHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold">Bienvenido a Mi Tienda</h1>
        <p className="mt-2 text-gray-600">
          Explora nuestros productos y ofertas. Usa el menú para navegar.
        </p>
        <div className="mt-4">
          <Link to="/productos" className="text-blue-600 underline">
            Ver productos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UserHome;
