export type Semaforo = "verde" | "amarillo" | "rojo"
export type Sentido = "Ida" | "Vuelta"
export type Ocupacion = "Baja" | "Media" | "Alta"
export type Servicio = "Regular" | "Refuerzo"
export type ColumnaViva = "semaforo" | "actualizado"

export interface Autobus {
  id: number
  codigo: string
  linea: string
  destino: string
  parada: string
  sentido: Sentido
  ocupacion: Ocupacion
  semaforo: Semaforo
  haceSegundos: number
  reinicio: number
  velocidad: number
  retraso: number
  coche: string
  servicio: Servicio
}

export type Pulso = { id: number; valor: Semaforo }

export const TOTAL = 1000
export const PULSOS_POR_SEGUNDO = 8
export const CADENCIAS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100]

export const COLUMNAS = [
  "Código",
  "Línea",
  "Destino",
  "Parada",
  "Sentido",
  "Ocupación",
  "Semáforo",
  "Actualizado",
  "km/h",
  "Retraso",
  "Coche",
  "Servicio",
] as const

export const CAPAS = ["Mapa", "Flota", "Incidencias", "Turnos", "Talleres"] as const
