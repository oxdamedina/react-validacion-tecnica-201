import type { Ocupacion, Semaforo, Sentido, Servicio } from "../comun/modelo"
import { Casilla } from "../comun/Casilla"
import { Luz } from "../comun/Luz"
import { useSegundos } from "../comun/reloj"

export function Codigo({ valor }: { valor: string }) {
  return <Casilla campo="codigo">{valor}</Casilla>
}

export function Linea({ valor }: { valor: string }) {
  return <Casilla campo="linea">{valor}</Casilla>
}

export function Destino({ valor }: { valor: string }) {
  return <Casilla campo="destino">{valor}</Casilla>
}

export function Parada({ valor }: { valor: string }) {
  return <Casilla campo="parada">{valor}</Casilla>
}

export function Sentido({ valor }: { valor: Sentido }) {
  return <Casilla campo="sentido">{valor}</Casilla>
}

export function Ocupacion({ valor }: { valor: Ocupacion }) {
  return <Casilla campo="ocupacion">{valor}</Casilla>
}

export function Semaforo({ valor }: { valor: Semaforo }) {
  return (
    <Casilla campo="semaforo">
      <Luz valor={valor} />
    </Casilla>
  )
}

export function Actualizado({ reinicio, inicial }: { reinicio: number; inicial: number }) {
  const segundos = useSegundos(reinicio, inicial)
  return <Casilla campo="actualizado">hace {segundos} s</Casilla>
}

export function Velocidad({ valor }: { valor: number }) {
  return <Casilla campo="velocidad">{valor}</Casilla>
}

export function Retraso({ valor }: { valor: number }) {
  return <Casilla campo="retraso">{valor} min</Casilla>
}

export function Coche({ valor }: { valor: string }) {
  return <Casilla campo="coche">{valor}</Casilla>
}

export function Servicio({ valor }: { valor: Servicio }) {
  return <Casilla campo="servicio">{valor}</Casilla>
}
