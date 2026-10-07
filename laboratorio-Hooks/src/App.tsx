import { useState } from "react";
import { entregables } from "./datos/entregables";
import type { Entregable } from "./models/Entregrable";
import { Tarjeta } from "./components/";
import { conSombra } from "./hoc/conSombra";
const TarjetaConSombra = conSombra(Tarjeta, {radio: 30, padding: 4});

export default function App() {
  const [texto, setTexto] = useState("")
  const [items, setItems] = useState<Entregable[]>(entregables)

  const visibles = items.filter((item) => {
    const blob = `${item.titulo} ${item.proveedor} ${item.id}`.toLowerCase()
    return blob.includes(texto.toLowerCase())
  })

  function marcar(id: string): void {
    setItems((lista) =>
      lista.map((item) =>
        item.id === id ? { ...item, estado: "revisado" } : item,
      ),
    )
  }

  return (
    <main>
      <h1>Bandeja de entregables</h1>
      <label htmlFor="filtro">Buscar</label>
      <input
        id="filtro"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
      />
      {visibles.length === 0 ? <p>Ningún entregable coincide.</p> : null}
      <ul className="lista">
        {visibles.map((item) => (
          <li key={item.id}>
            <TarjetaConSombra item={item} alMarcar={marcar} />
          </li>
        ))}
      </ul>
    </main>
  )
}