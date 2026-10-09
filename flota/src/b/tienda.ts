import { AUTOBUSES } from "../comun/datos"
import type { ColumnaViva, Pulso, Semaforo } from "../comun/modelo"
import { rotar } from "../comun/pulsos"

const semaforos: Semaforo[] = AUTOBUSES.map((bus) => bus.semaforo)
const reinicios: number[] = AUTOBUSES.map(() => 0)
const oyentes = new Map<string, Set<() => void>>()

function clave(id: number, columna: ColumnaViva): string {
  return `${id}:${columna}`
}

export function suscribir(id: number, columna: ColumnaViva, avisar: () => void): () => void {
  const idClave = clave(id, columna)
  let grupo = oyentes.get(idClave)
  if (!grupo) {
    grupo = new Set()
    oyentes.set(idClave, grupo)
  }
  grupo.add(avisar)
  return () => {
    grupo.delete(avisar)
  }
}

export function leerSemaforo(id: number): Semaforo {
  return semaforos[id]
}

export function leerReinicio(id: number): number {
  return reinicios[id]
}

export function aplicar(pulso: Pulso): void {
  semaforos[pulso.id] = pulso.valor === semaforos[pulso.id] ? rotar(semaforos[pulso.id]) : pulso.valor
  reinicios[pulso.id] += 1
  oyentes.get(clave(pulso.id, "semaforo"))?.forEach((avisar) => avisar())
  oyentes.get(clave(pulso.id, "actualizado"))?.forEach((avisar) => avisar())
}
