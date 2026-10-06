import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ContadorClase from './ejemplo-clase/ComponenteClase.tsx'
import Contador from './ejemplo-clase/Contador.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContadorClase titulo="Hola Mundo!" valorInicial={3}></ContadorClase>
    <ContadorClase titulo="Adiós Mundo!" valorInicial={10}></ContadorClase>
    <Contador titulo="Contador Funcional" valorInicial={5}></Contador>
    <App />
  </StrictMode>,
)
