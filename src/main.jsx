import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n' // Import i18n configuration

// Defer non-critical initialization
const startApp = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// Check if the browser is idle before rendering
if (window.requestIdleCallback) {
  window.requestIdleCallback(startApp);
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(startApp, 1);
}
