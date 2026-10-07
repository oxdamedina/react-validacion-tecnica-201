import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./estilos.css"
import { SesionProveedor } from "./context/Sesion"
import Ejemplo from "./components/Ejemplo.tsx"

const raiz = document.getElementById("raiz")
if (!raiz) {
  throw new Error("No está el nodo #raiz")
}

createRoot(raiz).render(
  <StrictMode>
    <SesionProveedor>
      <Ejemplo />
    </SesionProveedor>
  </StrictMode>,
)
