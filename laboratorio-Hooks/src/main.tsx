import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SesionProveedor } from './context/Sesion.tsx'
import App from './App.tsx'
import Ejemplo from './components/Ejemplo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SesionProveedor>
      <Ejemplo />
    </SesionProveedor>
  </StrictMode>,
)
