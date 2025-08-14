import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AppErrorBoundary from './components/AppErrorBoundary'
import React from 'react'

const container = document.getElementById("root");
if (!container) {
  const el = document.createElement('div');
  el.innerText = 'Root container not found.';
  document.body.appendChild(el);
} else {
  try {
    createRoot(container).render(
      <React.StrictMode>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </React.StrictMode>
    );
  } catch (err: any) {
    const pre = document.createElement('pre');
    pre.style.padding = '16px';
    pre.style.whiteSpace = 'pre-wrap';
    pre.textContent = 'App failed to start:\n' + String(err?.message || err);
    container.appendChild(pre);
    console.error('App boot error:', err);
  }
}
