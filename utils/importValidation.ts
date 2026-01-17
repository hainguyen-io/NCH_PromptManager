import { Prompt, Category } from '../types';

/**
 * Validate một prompt object
 */
export const isValidPrompt = (p: any): p is Prompt => {
  // Required fields
  if (!p.id || typeof p.id !== 'string') return false;
  if (!p.title || typeof p.title !== 'string') return false;
  if (!p.content || typeof p.content !== 'string') return false;
  if (!p.categoryId || typeof p.categoryId !== 'string') return false;
  
  // Optional but must be correct type if present
  if (p.description !== undefined && typeof p.description !== 'string') return false;
  
  // Arrays
  if (!Array.isArray(p.tags)) return false;
  if (!p.tags.every((tag: any) => typeof tag === 'string')) return false;
  
  // Numbers
  if (typeof p.viewCount !== 'number' || p.viewCount < 0) return false;
  if (typeof p.createdAt !== 'number') return false;
  
  // Boolean
  if (typeof p.isFavorite !== 'boolean') return false;
  
  // String fields
  if (typeof p.author !== 'string') return false;
  
  return true;
};

/**
 * Validate toàn bộ import data
 */
export interface ValidationResult {
  isValid: boolean;
  validPrompts: Prompt[];
  invalidPrompts: Array<{ prompt: any; errors: string[] }>;
  errors: string[];
  warnings: string[];
}

export const validateImportData = (
  json: any,
  existingPrompts: Prompt[],
  existingCategories: Category[],
  importedCategories: Category[] = []
): ValidationResult => {
  const result: ValidationResult = {
    isValid: false,
    validPrompts: [],
    invalidPrompts: [],
    errors: [],
    warnings: [],
  };
  
  // Validate top-level structure
  if (!json || typeof json !== 'object') {
    result.errors.push('Invalid JSON structure');
    return result;
  }
  
  if (json.app !== 'PromptVault') {
    result.errors.push('Invalid app identifier. Expected "PromptVault"');
  }
  
  if (!Array.isArray(json.prompts)) {
    result.errors.push('Prompts must be an array');
    return result;
  }
  
  // Combine existing and imported categories
  const allCategories = [...existingCategories, ...importedCategories];
  const allCategoryIds = new Set(allCategories.map(c => c.id));
  
  // Validate each prompt
  const existingIds = new Set(existingPrompts.map(p => p.id));
  
  json.prompts.forEach((prompt: any, index: number) => {
    const errors: string[] = [];
    
    // Structure validation
    if (!isValidPrompt(prompt)) {
      errors.push('Invalid prompt structure');
      result.invalidPrompts.push({ prompt, errors });
      return;
    }
    
    // Data integrity checks
    if (prompt.title.trim().length === 0) {
      errors.push('Title cannot be empty');
    }
    
    if (prompt.content.trim().length === 0) {
      errors.push('Content cannot be empty');
    }
    
    if (prompt.title.length > 200) {
      errors.push('Title too long (max 200 characters)');
    }
    
    // Business logic validation
    if (existingIds.has(prompt.id)) {
      result.warnings.push(`Prompt "${prompt.title}" (ID: ${prompt.id}) already exists - will be skipped`);
    }
    
    // Category reference check
    if (!allCategoryIds.has(prompt.categoryId)) {
      errors.push(`Category "${prompt.categoryId}" does not exist`);
      result.warnings.push(
        `Prompt "${prompt.title}" references unknown category. Will be skipped.`
      );
    }
    
    // If no errors, add to valid prompts
    if (errors.length === 0) {
      result.validPrompts.push(prompt);
    } else {
      result.invalidPrompts.push({ prompt, errors });
    }
  });
  
  result.isValid = result.errors.length === 0 && result.validPrompts.length > 0;
  
  return result;
};
