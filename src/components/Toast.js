import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../store/slices/uiSlice';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = () => {
  const dispatch = useDispatch();
  const { show, message, type } = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, dispatch]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700';
      default:
        return 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      default:
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`max-w-sm w-full ${getBackgroundColor()} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => dispatch(hideToast())}
              className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast; 