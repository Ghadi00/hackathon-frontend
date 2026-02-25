import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./tailwind.css";
import './global.scss'
import RootLayout from './pages/root.layout.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootLayout />
  </StrictMode>,
)
