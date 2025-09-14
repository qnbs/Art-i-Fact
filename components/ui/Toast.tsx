import React from 'react';
import ReactDOM from 'react-dom';
import { useToast } from '../../contexts/ToastContext.tsx';
import { CheckCircleIcon, CloseIcon, InfoIcon } from '../IconComponents.tsx';

const icons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  error: <CloseIcon className="w-6 h-6 text-red-500" />,
  info: <InfoIcon className="w-6 h-6 text-blue-500" />,
};

const bgColorClasses = {
  success: 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-700',
  error: 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-700',
  info: 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-700',
};

const textColorClasses = {
    success: 'text-green-800 dark:text-green-200',
    error: 'text-red-800 dark:text-red-200',
    info: 'text-blue-800 dark:text-blue-200',
}

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  const el = document.getElementById('toast-root');

  if (!el) return null;

  return ReactDOM.createPortal(
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-5 right-5 z-[100] flex flex-col items-end gap-3"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-full max-w-sm p-4 rounded-lg shadow-lg border-l-4 flex items-center gap-4 animate-toast-in ${bgColorClasses[toast.type]} ${textColorClasses[toast.type]}`}
          role="alert"
        >
          <div className="flex-shrink-0">{icons[toast.type]}</div>
          <div className="flex-grow text-sm font-semibold">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>,
    el
  );
};