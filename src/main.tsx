import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/global.css';
import { App } from './App';
import { initAuthBroadcastSync } from '@/modules/auth/utils/authBroadcast';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('[main] Root element #root not found in document.');
}

// Synchronise logout across browser tabs via BroadcastChannel
initAuthBroadcastSync();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
