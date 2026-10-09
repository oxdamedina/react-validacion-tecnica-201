import type { Autobus } from "../comun/modelo"
import { COLUMNAS } from "../comun/modelo"
import { Casilla } from "../comun/Casilla"
import { Fila } from "./Fila"

export function Lista({ autobuses }: { autobuses: Autobus[] }) {
  return (
    <div className="lista">
      <div className="fila titulos">
        {COLUMNAS.map((nombre) => (
          <Casilla key={nombre}>{nombre}</Casilla>
        ))}
      </div>
      {autobuses.map((bus) => (
        <Fila key={bus.id} bus={bus} />
      ))}
    </div>
  )
}
