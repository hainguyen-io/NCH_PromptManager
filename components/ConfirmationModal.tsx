import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'approve' | 'reject' | 'warning' | 'danger';
  showReasonField?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  onReasonChange?: (reason: string) => void;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  showReasonField = false,
  reasonLabel = 'Reason',
  reasonPlaceholder = 'Enter reason...',
  onReasonChange,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');

  // Reset reason when modal closes
  useEffect(() => {
    if (!isOpen) {
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (showReasonField && onReasonChange) {
      onReasonChange(reason);
    }
    onConfirm();
  };

  const getIcon = () => {
    switch (type) {
      case 'approve':
        return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />;
      case 'reject':
        return <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'approve':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'reject':
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon and Title */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{getIcon()}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
            </div>

            {/* Message */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
            </div>

            {/* Reason field (optional) */}
            {showReasonField && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {reasonLabel}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (onReasonChange) {
                      onReasonChange(e.target.value);
                    }
                  }}
                  placeholder={reasonPlaceholder}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading || (showReasonField && !reason.trim())}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getConfirmButtonClass()}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
