import type { Pulso, Semaforo } from "./modelo"
import { TOTAL } from "./modelo"

const SEMAFOROS: Semaforo[] = ["verde", "amarillo", "rojo"]
let procesados = 0

export function pulsosProcesados(): number {
  return procesados
}

export function rotar(valor: Semaforo): Semaforo {
  const indice = SEMAFOROS.indexOf(valor)
  return SEMAFOROS[(indice + 1) % SEMAFOROS.length]
}

export function pulsoAleatorio(): Pulso {
  const id = Math.floor(Math.random() * TOTAL)
  const valor = SEMAFOROS[Math.floor(Math.random() * SEMAFOROS.length)]
  return { id, valor }
}

export function emitir(alRecibir: (pulso: Pulso) => void, porSegundo: number): () => void {
  const reloj = setInterval(() => {
    procesados += 1
    alRecibir(pulsoAleatorio())
  }, 1000 / porSegundo)
  return () => clearInterval(reloj)
}

export function textoPulso(codigo: string, pulso: Pulso): string {
  return `${codigo} · semáforo ${pulso.valor} · hace 0 s`
}
