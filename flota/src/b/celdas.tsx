import { memo, useCallback, useSyncExternalStore } from "react"
import { AUTOBUSES } from "../comun/datos"
import { Casilla } from "../comun/Casilla"
import { Luz } from "../comun/Luz"
import { useSegundos } from "../comun/reloj"
import { leerReinicio, leerSemaforo, suscribir } from "./tienda"

export const Codigo = memo(function Codigo({ id }: { id: number }) {
  return <Casilla campo="codigo">{AUTOBUSES[id].codigo}</Casilla>
})

export const Linea = memo(function Linea({ id }: { id: number }) {
  return <Casilla campo="linea">{AUTOBUSES[id].linea}</Casilla>
})

export const Destino = memo(function Destino({ id }: { id: number }) {
  return <Casilla campo="destino">{AUTOBUSES[id].destino}</Casilla>
})

export const Parada = memo(function Parada({ id }: { id: number }) {
  return <Casilla campo="parada">{AUTOBUSES[id].parada}</Casilla>
})

export const Sentido = memo(function Sentido({ id }: { id: number }) {
  return <Casilla campo="sentido">{AUTOBUSES[id].sentido}</Casilla>
})

export const Ocupacion = memo(function Ocupacion({ id }: { id: number }) {
  return <Casilla campo="ocupacion">{AUTOBUSES[id].ocupacion}</Casilla>
})

export const Semaforo = memo(function Semaforo({ id }: { id: number }) {
  const suscribirse = useCallback((avisar: () => void) => suscribir(id, "semaforo", avisar), [id])
  const valor = useSyncExternalStore(suscribirse, () => leerSemaforo(id))
  return (
    <Casilla campo="semaforo">
      <Luz valor={valor} />
    </Casilla>
  )
})

export const Actualizado = memo(function Actualizado({ id }: { id: number }) {
  const suscribirse = useCallback((avisar: () => void) => suscribir(id, "actualizado", avisar), [id])
  const reinicio = useSyncExternalStore(suscribirse, () => leerReinicio(id))
  const segundos = useSegundos(reinicio, AUTOBUSES[id].haceSegundos)
  return <Casilla campo="actualizado">hace {segundos} s</Casilla>
})

export const Velocidad = memo(function Velocidad({ id }: { id: number }) {
  return <Casilla campo="velocidad">{AUTOBUSES[id].velocidad}</Casilla>
})

export const Retraso = memo(function Retraso({ id }: { id: number }) {
  return <Casilla campo="retraso">{AUTOBUSES[id].retraso} min</Casilla>
})

export const Coche = memo(function Coche({ id }: { id: number }) {
  return <Casilla campo="coche">{AUTOBUSES[id].coche}</Casilla>
})

export const Servicio = memo(function Servicio({ id }: { id: number }) {
  return <Casilla campo="servicio">{AUTOBUSES[id].servicio}</Casilla>
})
