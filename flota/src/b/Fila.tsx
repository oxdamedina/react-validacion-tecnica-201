import { memo, useState } from "react"
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

export const Fila = memo(function Fila({ id }: { id: number }) {
  const [marcada, setMarcada] = useState(false)
  return (
    <div
      className={marcada ? "fila marcada" : "fila"}
      onClick={() => setMarcada((valor) => !valor)}
    >
      <Codigo id={id} />
      <Linea id={id} />
      <Destino id={id} />
      <Parada id={id} />
      <Sentido id={id} />
      <Ocupacion id={id} />
      <Semaforo id={id} />
      <Actualizado id={id} />
      <Velocidad id={id} />
      <Retraso id={id} />
      <Coche id={id} />
      <Servicio id={id} />
    </div>
  )
})
