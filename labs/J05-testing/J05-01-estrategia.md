# J05-01 — Estrategia

[← Página anterior](README.md) · [Siguiente página →](J05-02-vision.md)

Un test de esta jornada afirma lo que vería una persona: un título presente, otro ausente. No afirma el valor de `useState`. El caso que ya está en el repo solo mira el `<h1>`. No mira el filtro ni la pastilla.

## Demostración

### Objetivo

Leer el caso que ya existe y escribir, en un comentario del propio archivo, lo que no cubre.

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

`bandeja/cypress/e2e/bandeja.cy.js` es solo el caso del título:

```js
describe("bandeja", () => {
  it("muestra el título", () => {
    cy.visit("/")
    cy.contains("h1", "Bandeja de entregables")
  })
})
```

### 1 — Lo que el caso no mira

**Dónde:** `bandeja.cy.js`, debajo del `it` del título.

**Qué haces:**

1. Lee el `it`.
2. Añade un comentario con tres cosas que no afirma.
3. No lances el script todavía. El laboratorio siguiente lo hace.

```js
// No mira: el filtro, la pastilla, el vacío de la caja.
```

**Experimento:** imagina el filtro roto y el título intacto. Di si este `it` fallaría.

→ No fallaría. El caso solo busca el `<h1>`. El comentario se queda hasta que exista un caso que escriba en la caja.

**Validación:**

- El `it` del título no se ha borrado.
- El comentario nombra el filtro.

## Comprueba tu entendimiento

**Qué afirmaría una persona**
Al escribir `Este`, una ficha se queda y otra no.
→ Eso es un caso. El título solo no lo es.

## Reto

### 1 — Otra frase que tampoco está cubierta

Añade al comentario «el foco de la etiqueta Buscar».
→ El caso del título no pulsa la etiqueta. El checklist de la jornada sí.

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| No hay archivo de Cypress | No estás en `bandeja/cypress/e2e/` | `bandeja.cy.js` |
| El comentario rompe el script | Quedó fuera de un `/* */` o sin `//` | Una línea `//` dentro del `describe` |

## Laboratorio

La demostración nombró lo que el caso del título no mira y decidió el caso de `Este`. Aquí escribes otro caso, el del vacío, y no lo implementas todavía.

### Objetivo

Dejar en un comentario el caso de `zzzz`, distinto del de `Este`.

### Código de partida

`bandeja.cy.js` tiene el `it` del título. Puede tener ya el de `Este`. No lo borres.

### Qué haces

1. Debajo del último `it`, pega el comentario.
2. No añadas el `it` de `zzzz` en este ejercicio. Eso sería otro caso, y aquí solo fijas qué afirmaría.
3. Lee el comentario en voz alta: es una frase de la página, no un `useState`.

```js
// Caso pendiente: visitar /, escribir zzzz en #filtro
// y ver «Ningún entregable coincide.».
// No afirma el valor de texto ni de items.
```

→ El archivo sigue pasando `npm run test:e2e` igual que antes del comentario. El caso de `Este`, si está, no cubre esta frase.
