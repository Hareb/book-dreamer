import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initMockElectronIfNeeded } from './utils/mockElectron';

// Initialize mock Electron API if running in web mode (for development)
initMockElectronIfNeeded();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
