import type {Entregable} from "../models/Entregrable"
import { conSombra } from "../hoc/conSombra"

interface TarjetaProps {
  item: Entregable
  textoBoton?: string
  alMarcar: (id: string) => void;
  revisor: string;
}

function Tarjeta({
  item,
  textoBoton = "Anotar",
  alMarcar,
  revisor
}: TarjetaProps) {
  return (
    <article>
      <p>{item.titulo}</p>
      <p>
        {item.id} · {item.proveedor}
      </p>
      <p>Revisor: {revisor}</p>
      <p className={`estado ${item.estado}`}>{item.estado}</p>
      {item.estado === "pendiente" ? <p>Falta revisión</p> : null}
      <button type="button" onClick={() => alMarcar(item.id)}>
        {item.estado === "revisado" ? "Hecho" : textoBoton} {item.id}
      </button>
    </article>
  )
}

export default conSombra(Tarjeta)