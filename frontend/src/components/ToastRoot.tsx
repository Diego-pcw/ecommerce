import React from 'react';
import { useToast } from '../context/ToastContext';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import '../styles/home/layout.shared.css';

const ToastRoot: React.FC = () => {
  const { toasts, remove } = useToast();

  const getIcon = (type: string | undefined) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon success" size={20} />;
      case 'error':
        return <AlertCircle className="toast-icon error" size={20} />;
      case 'warning':
        return <AlertTriangle className="toast-icon warning" size={20} />;
      case 'info':
      default:
        return <Info className="toast-icon info" size={20} />;
    }
  };

  return (
    <div className="toast-root">
      {toasts.map((t) => (
        <div key={t.id} className="toast-item">
          {getIcon(t.type)}
          <div className="toast-message">{t.message}</div>
          <button onClick={() => remove(t.id)} className="toast-close-btn">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastRoot;