import React from "react";
import HeroBanner from "../components/home/HeroBanner";
import MarcasDestacadas from "../components/home/MarcasDestacadas";
import CategoriasDestacadas from "../components/home/CategoriasDestacadas";
import ProductosDestacados from "../components/home/ProductosDestacados";
import PromocionesDestacadas from "../components/home/PromocionesDestacadas";
import ReseñasDestacadas from "../components/home/ReseñasDestacadas";
import FormularioContacto from "../components/home/FormularioContacto";

import "../styles/home.shared.css";

const UserHome: React.FC = () => {
  return (
    <div className="home-wrapper">
      <HeroBanner />
      <PromocionesDestacadas />
      <ProductosDestacados />
      <CategoriasDestacadas />
      <MarcasDestacadas />
      <ReseñasDestacadas />
      <FormularioContacto />
    </div>
  );
};

export default UserHome;