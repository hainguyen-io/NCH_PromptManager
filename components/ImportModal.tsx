import React from 'react';
import { X, AlertCircle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { ValidationResult } from '../utils/importValidation';
import { Prompt, Category } from '../types';

interface ImportModalProps {
  validationResult: ValidationResult;
  importedCategories?: Category[];
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({
  validationResult,
  importedCategories = [],
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const { validPrompts, invalidPrompts, warnings, errors } = validationResult;
  const hasValidPrompts = validPrompts.length > 0;
  const hasWarnings = warnings.length > 0;
  const hasErrors = errors.length > 0;
  const hasInvalidPrompts = invalidPrompts.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onCancel : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Import Preview
          </h2>
          {!isLoading && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {validPrompts.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Valid Prompts
              </div>
            </div>
            
            {hasWarnings && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {warnings.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Warnings
                </div>
              </div>
            )}
            
            {hasInvalidPrompts && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {invalidPrompts.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Invalid
                </div>
              </div>
            )}
            
            {importedCategories.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {importedCategories.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Categories
                </div>
              </div>
            )}
          </div>
          
          {/* Errors */}
          {hasErrors && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    Errors
                  </h3>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Warnings */}
          {hasWarnings && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Warnings
                  </h3>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 max-h-32 overflow-y-auto">
                    {warnings.slice(0, 10).map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                    {warnings.length > 10 && (
                      <li className="text-yellow-600 dark:text-yellow-400 italic">
                        ... and {warnings.length - 10} more warnings
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Preview List */}
          {hasValidPrompts && (
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500" />
                Prompts to Import ({validPrompts.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {validPrompts.slice(0, 10).map((prompt) => (
                  <div 
                    key={prompt.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-3 border border-gray-200 dark:border-gray-600"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {prompt.title}
                      </div>
                      {prompt.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {prompt.description}
                        </div>
                      )}
                      {prompt.tags.length > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Tags: {prompt.tags.slice(0, 3).join(', ')}
                          {prompt.tags.length > 3 && '...'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {validPrompts.length > 10 && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                    ... and {validPrompts.length - 10} more prompts
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* No Valid Prompts Message */}
          {!hasValidPrompts && !hasErrors && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No valid prompts to import.
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!hasValidPrompts || isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Importing...' : `Import ${validPrompts.length} Prompts`}
          </button>
        </div>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-2xl backdrop-blur-sm">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Importing...</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Please wait</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportModal;
