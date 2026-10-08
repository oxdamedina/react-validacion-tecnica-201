# J05-05 — Checklist

[← Página anterior](J05-04-entregable.md) · [Siguiente página →](J05-06-riesgos.md)

El checklist es una lista corta que se puede repetir en otra entrega. Cada fila es una acción y lo que se ve. El caso de Cypress cubre el título y el filtro de `Este`. No cubre el foco ni la recarga.

## Demostración

### Objetivo

Recorrer la lista de la guía y marcar qué fila cubre el caso de Cypress y cuál no.

### Código de partida

Pega estos dos archivos y recarga `http://localhost:5173`. Hay seis fichas y una caja «Buscar». El botón de una pendiente dice «Anotar» y, al pulsarlo, «Hecho».

`bandeja/src/App.tsx`

```tsx
import { useState } from "react"
import { entregables } from "./datos"
import type { Entregable } from "./modelo"
import Tarjeta from "./componentes/Tarjeta"

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
            <Tarjeta item={item} alMarcar={marcar} />
          </li>
        ))}
      </ul>
    </main>
  )
}
```

`bandeja/src/componentes/Tarjeta.tsx`

```tsx
import type { Entregable } from "../modelo"

interface TarjetaProps {
  item: Entregable
  textoBoton?: string
  alMarcar: (id: string) => void
}

export default function Tarjeta({
  item,
  textoBoton = "Anotar",
  alMarcar,
}: TarjetaProps) {
  return (
    <article>
      <p>{item.titulo}</p>
      <p>
        {item.id} · {item.proveedor}
      </p>
      <p className={`estado ${item.estado}`}>{item.estado}</p>
      {item.estado === "pendiente" ? <p>Falta revisión</p> : null}
      <button type="button" onClick={() => alMarcar(item.id)}>
        {item.estado === "revisado" ? "Hecho" : textoBoton} {item.id}
      </button>
    </article>
  )
}
```

`bandeja/cypress/e2e/bandeja.cy.js` tiene el título y el filtro. Si falta el de `Este`, sustituye el archivo por este:

```js
describe("bandeja", () => {
  it("muestra el título", () => {
    cy.visit("/")
    cy.contains("h1", "Bandeja de entregables")
  })

  it("filtra por Este", () => {
    cy.visit("/")
    cy.get("#filtro").type("Este")
    cy.contains("Inventario de componentes")
    cy.contains("Informe de accesibilidad").should("not.exist")
  })
})
```

### 1 — La tabla, en la bandeja

**Dónde:** el navegador, en este orden.

**Qué haces:**

1. Abre `/`. El título es «Bandeja de entregables».
2. Escribe `Norte`. No están las seis.
3. Escribe `zzzz`. Se lee «Ningún entregable coincide.».
4. Pulsa «Buscar». El foco está en la caja.
5. Borra, marca una pendiente. Pastilla `revisado`, botón «Hecho».
6. Recarga. La marca no sigue.

**Experimento:** al lado de cada fila, di si el `it` de Cypress la ejecuta.

→ El caso del título cubre la fila 1. El de `Este` cubre un filtro, no exactamente `Norte`, ni el vacío, ni el foco, ni la recarga. Esas filas se miran a mano. No hace falta rellenar un formulario: el recorrido es el laboratorio.

**Validación:**

- Las seis filas se han hecho.
- El caso de `Este` sigue en el archivo.
- No has borrado un `it` para «dejarlo limpio».

## Comprueba tu entendimiento

**Para qué se repite**
La misma tabla sirve en otra entrega que tenga caja, lista y una acción.
→ Cambian los textos. No cambia la pregunta: qué se ve.

## Reto

### 1 — Una fila de red

Si la lista sale de `/entregables.json`, teclea con Network abierto.
→ No se repite esa petición. Si la lista sale de `datos.ts`, la fila no aplica y se anota así.

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| `Norte` no quita fichas | El `map` no recorre `visibles` | El `map` de `App.tsx`, el de esta página, recorre `visibles` |
| La marca sobrevive | Hay otro mecanismo de guardado | En esta bandeja, recargar restaura el origen |

## Laboratorio

La demostración recorrió la tabla que ya estaba. Aquí añades una fila que la tabla no tenía: el rechazado.

### Objetivo

Comprobar E-104, que nace `rechazado`, y anotar la frase del botón.

### Código de partida

La bandeja en el 5173. El caso de Cypress, si está, no se lanza en este ejercicio.

### Qué haces

1. Recarga.
2. Busca «Inventario de componentes».
3. Lee la pastilla y el botón. Anota la frase exacta, por ejemplo en un comentario al final de `bandeja.cy.js`.
4. No cambies el componente para que el botón diga otra cosa.

```js
// Fila nueva: abrir E-104.
// Se ve la pastilla «rechazado» y un botón «Anotar E-104», no «Hecho».
```

→ La pastilla es `rechazado`. El botón no dice «Hecho», porque «Hecho» solo sale con `revisado`. El caso de `Este` no afirma esta fila.
