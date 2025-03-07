
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './utils/registerSW.ts'

// Register service worker for PWA
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
