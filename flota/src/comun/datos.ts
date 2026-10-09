import type { Autobus, Ocupacion, Semaforo, Sentido, Servicio } from "./modelo"
import { TOTAL } from "./modelo"

const LINEAS: Array<[string, string, string]> = [
  ["V3", "Zona Universitària", "Can Caralleu"],
  ["H6", "Onze de Setembre", "La Pau"],
  ["D20", "Pg. Marítim", "Ernest Lluch"],
  ["H8", "Camp Nou", "La Maquinista"],
  ["V15", "Barceloneta", "Can Dragó"],
  ["6", "Pg. Manuel Girona", "Poblenou"],
  ["7", "Diagonal Mar", "Maria Cristina"],
  ["24", "Paral·lel", "Carmel"],
  ["33", "Zona Franca", "Sarrià"],
  ["47", "Pg. Marítim", "Canyelles"],
  ["54", "Estació del Nord", "Carmel"],
  ["60", "Pg. Valldaura", "Plaça Catalunya"],
  ["63", "Plaça Universitat", "Sant Martí"],
  ["67", "Plaça Catalunya", "Cornellà"],
  ["D40", "Plaça Espanya", "Montbau"],
  ["H12", "Besòs", "Gornal"],
  ["V21", "Montbau", "Barceloneta"],
  ["27", "Pg. Marítim", "Roquetes"],
  ["39", "Barceloneta", "Finestrelles"],
  ["59", "Plaça Reial", "Can Peixauet"],
]

const PARADAS = [
  "Plaça Catalunya",
  "Sants Estació",
  "Espanya",
  "Urquinaona",
  "Clot",
  "Sagrada Família",
  "Hospital Clínic",
  "Glòries",
  "La Sagrera",
  "Fabra i Puig",
  "Virrei Amat",
  "Mundet",
  "Diagonal",
  "Lesseps",
  "Fontana",
  "Poble Sec",
]

const SEMAFOROS: Semaforo[] = ["verde", "amarillo", "rojo"]
const OCUPACION: Ocupacion[] = ["Baja", "Media", "Alta"]

export const AUTOBUSES: Autobus[] = Array.from({ length: TOTAL }, (_, id) => {
  const [linea, cabecera, cola] = LINEAS[id % LINEAS.length]
  const sentido: Sentido = id % 2 === 0 ? "Ida" : "Vuelta"
  const servicio: Servicio = id % 11 === 0 ? "Refuerzo" : "Regular"
  return {
    id,
    codigo: `B-${String(1001 + id)}`,
    linea,
    destino: sentido === "Ida" ? cola : cabecera,
    parada: PARADAS[id % PARADAS.length],
    sentido,
    ocupacion: OCUPACION[id % OCUPACION.length],
    semaforo: SEMAFOROS[id % SEMAFOROS.length],
    haceSegundos: (id * 7) % 50,
    reinicio: 0,
    velocidad: 8 + (id % 28),
    retraso: id % 9,
    coche: String(2000 + (id % 400)),
    servicio,
  }
})
