import type { Semaforo } from "./modelo"

const TEXTO: Record<Semaforo, string> = {
  verde: "Verde",
  amarillo: "Amarillo",
  rojo: "Rojo",
}

export function Luz({ valor }: { valor: Semaforo }) {
  return (
    <span className="estado-luz">
      <span className={`luz ${valor}`} />
      {TEXTO[valor]}
    </span>
  )
}
