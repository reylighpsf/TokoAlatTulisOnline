// resources/js/main.tsx
import { createRoot } from 'react-dom/client'
import '../css/shadcn.css'
import App from './app.tsx' // jangan .js, biarkan Vite handle

const root = createRoot(document.getElementById('app')!)
root.render(<App />)
