import { useEffect, useRef, useState } from "react"

type Reloj = { oidores: Set<() => void> }

const ambito = globalThis as typeof globalThis & { __flotaReloj?: Reloj }
const previo = ambito.__flotaReloj
const reloj: Reloj =
  previo && typeof previo === "object" && previo.oidores instanceof Set
    ? previo
    : { oidores: new Set() }
if (ambito.__flotaReloj !== reloj) {
  ambito.__flotaReloj = reloj
  setInterval(() => {
    reloj.oidores.forEach((avisar) => avisar())
  }, 1000)
}

export function useSegundos(reinicio: number, inicial: number): number {
  const [segundos, setSegundos] = useState(inicial)
  const visto = useRef(reinicio)
  if (visto.current !== reinicio) {
    visto.current = reinicio
    setSegundos(0)
  }

  useEffect(() => {
    const avisar = () => setSegundos((valor) => valor + 1)
    reloj.oidores.add(avisar)
    return () => {
      reloj.oidores.delete(avisar)
    }
  }, [])

  return segundos
}
