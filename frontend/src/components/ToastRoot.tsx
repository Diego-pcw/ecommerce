// src/components/ToastRoot.tsx
import React from "react";
import { useToast } from "../context/ToastContext";

const ToastRoot: React.FC = () => {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="shadow-lg px-4 py-2 rounded bg-white border flex items-center gap-3"
        >
          <div className="text-sm">{t.message}</div>
          <button
            onClick={() => remove(t.id)}
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastRoot;
