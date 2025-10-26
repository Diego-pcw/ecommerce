import React, { Suspense } from "react";
import Router from "./router";
import ToastRoot from "./components/ToastRoot";
import { useAuth } from "./context/AuthContext";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando página...</div>}>
        <Router />
      </Suspense>
      <ToastRoot />
    </>
  );
}

export default App;
