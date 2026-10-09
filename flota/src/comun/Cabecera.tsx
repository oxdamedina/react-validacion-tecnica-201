import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react"
import { CADENCIAS } from "./modelo"
import { useMarca } from "./marca"
import { pulsosProcesados } from "./pulsos"

export function Cabecera({
  titulo,
  detalle,
  enMarcha,
  cadencia,
  alAlternar,
  alCadencia,
}: {
  titulo: string
  detalle: string
  enMarcha: boolean
  cadencia: number
  alAlternar: () => void
  alCadencia: (valor: number) => void
}) {
  const { clase, renders } = useMarca()
  const commits = useRef(0)
  useLayoutEffect(() => {
    commits.current += 1
  })
  const indice = CADENCIAS.indexOf(cadencia)
  const anterior = CADENCIAS[indice - 1]
  const siguiente = CADENCIAS[indice + 1]
  return (
    <header className={`cabecera ${clase}`} data-chrome="cabecera" data-renders={renders}>
      <div>
        <h1>{titulo}</h1>
        <p>{detalle}</p>
      </div>
      <p className="leyenda">El fondo ámbar es un render.</p>
      <div className="cadencia">
        <span>Pulsos/s</span>
        <button type="button" onClick={() => alCadencia(anterior)} disabled={anterior === undefined}>
          −
        </button>
        <strong>{cadencia}</strong>
        <button type="button" onClick={() => alCadencia(siguiente)} disabled={siguiente === undefined}>
          +
        </button>
        <Ritmo commits={commits} />
      </div>
      <button type="button" onClick={alAlternar}>
        {enMarcha ? "Pausar emisión" : "Reanudar emisión"}
      </button>
    </header>
  )
}

function Ritmo({ commits }: { commits: RefObject<number> }) {
  const muestra = useRef({ pulsos: pulsosProcesados(), renders: 0, instante: performance.now() })
  const [texto, setTexto] = useState("midiendo…")

  useEffect(() => {
    muestra.current = {
      pulsos: pulsosProcesados(),
      renders: commits.current ?? 0,
      instante: performance.now(),
    }
    const id = setInterval(() => {
      const ahora = performance.now()
      const pulsos = pulsosProcesados()
      const pintados = commits.current ?? 0
      const segundos = (ahora - muestra.current.instante) / 1000
      const deltaPulsos = pulsos - muestra.current.pulsos
      const deltaRenders = Math.max(0, pintados - muestra.current.renders)
      muestra.current = { pulsos, renders: pintados, instante: ahora }
      const porSegundo = (cantidad: number) => Math.round(cantidad / segundos)
      setTexto(`procesa ${porSegundo(deltaPulsos)}/s · renders ${porSegundo(deltaRenders)}/s`)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="ritmo" data-ritmo={texto}>
      {texto}
    </span>
  )
}
