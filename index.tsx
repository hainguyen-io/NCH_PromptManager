import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Error boundary for rendering
try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1 style="color: red;">Error Loading App</h1>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      <button onclick="window.location.reload()">Reload</button>
    </div>
  `;
}
