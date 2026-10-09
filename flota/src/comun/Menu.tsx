import { useState } from "react"
import { CAPAS } from "./modelo"
import { useMarca } from "./marca"

export function Menu() {
  const [capa, setCapa] = useState<(typeof CAPAS)[number]>("Flota")
  const { clase, renders } = useMarca()
  return (
    <nav className={`menu ${clase}`} data-chrome="menu" data-renders={renders}>
      <p className="menu-titulo">Capas</p>
      <ul>
        {CAPAS.map((nombre) => (
          <li key={nombre}>
            <button
              type="button"
              className={nombre === capa ? "capa activa" : "capa"}
              onClick={() => setCapa(nombre)}
            >
              {nombre}
            </button>
          </li>
        ))}
      </ul>
      <p className="menu-nota">Capa activa: {capa}. No filtra la flota.</p>
    </nav>
  )
}
