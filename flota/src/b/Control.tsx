import { useEffect, useState } from "react"
import { Cabecera } from "../comun/Cabecera"
import { AUTOBUSES } from "../comun/datos"
import { PULSOS_POR_SEGUNDO } from "../comun/modelo"
import { emitir, textoPulso } from "../comun/pulsos"
import { aplicar } from "./tienda"

export function Control() {
  const [enMarcha, setEnMarcha] = useState(true)
  const [cadencia, setCadencia] = useState(PULSOS_POR_SEGUNDO)
  const [ultimo, setUltimo] = useState("Esperando el primer pulso")

  useEffect(() => {
    if (!enMarcha) return
    return emitir((pulso) => {
      aplicar(pulso)
      setUltimo(textoPulso(AUTOBUSES[pulso.id].codigo, pulso))
    }, cadencia)
  }, [enMarcha, cadencia])

  return (
    <Cabecera
      titulo="Flota B"
      detalle={ultimo}
      enMarcha={enMarcha}
      cadencia={cadencia}
      alAlternar={() => setEnMarcha((valor) => !valor)}
      alCadencia={setCadencia}
    />
  )
}
