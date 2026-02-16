
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Fatal Error: Could not find root element with id 'root'");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error during React mounting:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">Terjadi kesalahan saat memuat aplikasi. Silakan muat ulang halaman.</div>`;
  }
}
