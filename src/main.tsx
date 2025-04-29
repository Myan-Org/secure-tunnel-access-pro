
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error boundary for better error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Initialize the app with a try-catch to capture any startup errors
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  createRoot(rootElement).render(<App />);
  console.log("App mounted successfully");
} catch (error) {
  console.error("Failed to initialize app:", error);
  // Show fallback UI for critical errors
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:20px;text-align:center;">
        <h1 style="margin-bottom:16px;color:#6366f1;">Myan VPN</h1>
        <p style="margin-bottom:24px;">Unable to load app. Please try again later.</p>
        <button style="padding:8px 16px;background:#6366f1;color:white;border:none;border-radius:4px;" 
                onclick="window.location.reload()">Reload App</button>
      </div>
    `;
  }
}
