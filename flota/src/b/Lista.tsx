import { memo } from "react"
import { COLUMNAS } from "../comun/modelo"
import { AUTOBUSES } from "../comun/datos"
import { Casilla } from "../comun/Casilla"
import { Fila } from "./Fila"

export const Lista = memo(function Lista() {
  return (
    <div className="lista">
      <div className="fila titulos">
        {COLUMNAS.map((nombre) => (
          <Casilla key={nombre}>{nombre}</Casilla>
        ))}
      </div>
      {AUTOBUSES.map((bus) => (
        <Fila key={bus.id} id={bus.id} />
      ))}
    </div>
  )
})
