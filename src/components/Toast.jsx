import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onClose }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let color = '#10b981';
        if (toast.type === 'error') {
          Icon = AlertCircle;
          color = '#ef4444';
        } else if (toast.type === 'info') {
          Icon = Info;
          color = '#0284c7';
        }

        return (
          <div key={toast.id} className="toast" style={{ borderLeftColor: color }}>
            <Icon size={20} color={color} />
            <div style={{ flex: 1 }}>{toast.message}</div>
            <button
              onClick={() => onClose(toast.id)}
              style={{ color: '#94a3b8', padding: '2px', display: 'flex' }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
