import React, { useRef, useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Download, Upload, RotateCcw, Database } from 'lucide-react';
import { useUIStore, usePromptStore, useCategoryStore } from '../store';
import { validateImportData, ValidationResult } from '../utils/importValidation';
import ImportModal from '../components/ImportModal';
import { Category } from '../types';

const Settings = () => {
  const { darkMode, toggleDarkMode, showToast } = useUIStore();
  const { prompts, importPrompts, resetPrompts } = usePromptStore();
  const { categories, importCategories } = useCategoryStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<{
    validation: ValidationResult;
    categories: Category[];
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    const data = {
      prompts,
      categories,
      exportedAt: new Date().toISOString(),
      app: 'PromptVault'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptvault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported successfully.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Step 1: Validate data structure
        const validation = validateImportData(json, prompts, categories);
        
        // Check for categories to import
        const categoriesToImport: Category[] = [];
        if (json.categories && Array.isArray(json.categories)) {
          const existingCategoryIds = new Set(categories.map(c => c.id));
          categoriesToImport.push(...json.categories.filter((c: any) => !existingCategoryIds.has(c.id)));
        }
        
        // Re-validate with imported categories (to catch category references)
        const finalValidation = validateImportData(
          json,
          prompts,
          categories,
          categoriesToImport
        );
        
        // Show preview modal
        setImportPreview({
          validation: finalValidation,
          categories: categoriesToImport,
        });
        
      } catch (err) {
        showToast(`Error parsing JSON file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;
    
    setIsImporting(true);
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { validation, categories: categoriesToImport } = importPreview;
      
      // Import categories first
      if (categoriesToImport.length > 0) {
        importCategories(categoriesToImport);
      }
      
      // Import prompts
      if (validation.validPrompts.length > 0) {
        importPrompts(validation.validPrompts);
        
        // Calculate stats
        const existingIds = new Set(prompts.map(p => p.id));
        const imported = validation.validPrompts.filter(p => !existingIds.has(p.id));
        const skipped = validation.validPrompts.length - imported.length;
        
        // Show success message
        let message = '';
        if (imported.length > 0) {
          message += `Imported ${imported.length} prompts`;
          if (skipped > 0) {
            message += `, skipped ${skipped} duplicates`;
          }
        }
        if (validation.invalidPrompts.length > 0) {
          message += message ? '. ' : '';
          message += `${validation.invalidPrompts.length} invalid prompts ignored`;
        }
        if (categoriesToImport.length > 0) {
          message += message ? '. ' : '';
          message += `${categoriesToImport.length} categories imported`;
        }
        
        if (!message) {
          message = 'No data to import.';
        } else {
          message += '.';
        }
        
        showToast(message);
      } else {
        showToast('No valid prompts to import.');
      }
      
      // Close modal
      setImportPreview(null);
    } catch (err) {
      showToast(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    if (confirm('DANGER: This will delete all your local changes and reset to default seed data. This cannot be undone.')) {
      resetPrompts();
      localStorage.clear();
      location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-10 px-4 sm:px-0">
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-primary-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-yellow-100 text-yellow-600'}`}>
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle application theme</p>
              </div>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                darkMode ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-500" />
            Data Management
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleExport}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </button>
              
              <div className="flex-1">
                <input 
                  type="file" 
                  accept=".json" 
                  ref={fileInputRef}
                  className="hidden" 
                  onChange={handleImport}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import JSON
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
               <button 
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Application Data
              </button>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Warning: This deletes all data stored in your browser's LocalStorage.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      {/* Import Preview Modal */}
      {importPreview && (
        <ImportModal
          validationResult={importPreview.validation}
          importedCategories={importPreview.categories}
          isLoading={isImporting}
          onConfirm={handleConfirmImport}
          onCancel={() => setImportPreview(null)}
        />
      )}
    </div>
  );
};

export default Settings;
