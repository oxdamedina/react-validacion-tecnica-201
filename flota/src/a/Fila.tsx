import { useState } from "react"
import type { Autobus } from "../comun/modelo"
import {
  Actualizado,
  Coche,
  Codigo,
  Destino,
  Linea,
  Ocupacion,
  Parada,
  Retraso,
  Semaforo,
  Sentido,
  Servicio,
  Velocidad,
} from "./celdas"

export function Fila({ bus }: { bus: Autobus }) {
  const [marcada, setMarcada] = useState(false)
  return (
    <div
      className={marcada ? "fila marcada" : "fila"}
      onClick={() => setMarcada((valor) => !valor)}
    >
      <Codigo valor={bus.codigo} />
      <Linea valor={bus.linea} />
      <Destino valor={bus.destino} />
      <Parada valor={bus.parada} />
      <Sentido valor={bus.sentido} />
      <Ocupacion valor={bus.ocupacion} />
      <Semaforo valor={bus.semaforo} />
      <Actualizado reinicio={bus.reinicio} inicial={bus.haceSegundos} />
      <Velocidad valor={bus.velocidad} />
      <Retraso valor={bus.retraso} />
      <Coche valor={bus.coche} />
      <Servicio valor={bus.servicio} />
    </div>
  )
}
