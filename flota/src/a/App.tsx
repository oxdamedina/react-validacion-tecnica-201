import { useEffect, useState } from "react"
import { Cabecera } from "../comun/Cabecera"
import { Menu } from "../comun/Menu"
import { AUTOBUSES } from "../comun/datos"
import { PULSOS_POR_SEGUNDO, type Autobus, type Pulso, type Semaforo } from "../comun/modelo"
import { emitir, rotar, textoPulso } from "../comun/pulsos"
import { Lista } from "./Lista"
import "../comun/estilos.css"

function aplicar(lista: Autobus[], pulso: Pulso): Autobus[] {
  return lista.map((bus) => {
    if (bus.id !== pulso.id) return bus
    const semaforo: Semaforo = pulso.valor === bus.semaforo ? rotar(bus.semaforo) : pulso.valor
    return { ...bus, semaforo, reinicio: bus.reinicio + 1 }
  })
}

export default function App() {
  const [autobuses, setAutobuses] = useState<Autobus[]>(() => AUTOBUSES.map((bus) => ({ ...bus })))
  const [enMarcha, setEnMarcha] = useState(true)
  const [cadencia, setCadencia] = useState(PULSOS_POR_SEGUNDO)
  const [ultimo, setUltimo] = useState("Esperando el primer pulso")

  useEffect(() => {
    if (!enMarcha) return
    return emitir((pulso) => {
      setAutobuses((lista) => aplicar(lista, pulso))
      const codigo = AUTOBUSES[pulso.id].codigo
      setUltimo(textoPulso(codigo, pulso))
    }, cadencia)
  }, [enMarcha, cadencia])

  return (
    <div className="marco">
      <Cabecera
        titulo="Flota A"
        detalle={ultimo}
        enMarcha={enMarcha}
        cadencia={cadencia}
        alAlternar={() => setEnMarcha((valor) => !valor)}
        alCadencia={setCadencia}
      />
      <Menu />
      <main className="panel">
        <Lista autobuses={autobuses} />
      </main>
    </div>
  )
}
