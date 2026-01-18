/**
 * Utility function to copy text to clipboard with fallback support
 * 
 * Tries modern Clipboard API first, falls back to execCommand if needed
 * Works across different browsers and contexts (HTTP/HTTPS)
 */

export const copyToClipboard = async (text: string): Promise<boolean> => {
  // Try modern Clipboard API first (HTTPS required in most browsers)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('Clipboard API failed, trying fallback:', error);
      // Fall through to fallback method
    }
  }

  // Fallback: Use execCommand (deprecated but widely supported)
  // This works in HTTP contexts and older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make textarea invisible but still accessible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // Try to copy
    const successful = document.execCommand('copy');
    
    // Cleanup
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Fallback copy method failed:', error);
    return false;
  }
};
