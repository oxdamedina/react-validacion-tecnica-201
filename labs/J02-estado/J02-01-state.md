# J02-01 — State

[← Página anterior](README.md) · [Siguiente página →](J02-02-usestate.md)

Una variable normal dentro de `App` se pierde en el siguiente pintado. El estado es un valor que React recuerda. Al pedir el siguiente, React vuelve a ejecutar la función. No se muta el array a mano. Se entrega un array nuevo. Si no, la pastilla puede no cambiar.

## Demostración

### Objetivo

Ver que una variable normal no vuelve a pintar, y que mutar el mismo array tampoco.

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

### 1 — El let y la mutación

**Dónde:** `App.tsx`, el estado de la caja. Luego `marcar`.

**Qué haces:**

1. Sustituye el `useState` de `texto` por `let copia = ""`. El input usa `value={copia}` y `onChange` hace `copia = evento.target.value`.
2. Teclea. Restaura `useState`, `value={texto}` y `setTexto`.
3. En `marcar`, muta y devuelve la misma lista. Pulsa una ficha pendiente. Restaura el `map` con `{ ...item, estado: "revisado" }`.

```tsx
setItems((lista) => {
  lista.forEach((item) => {
    if (item.id === id) item.estado = "revisado"
  })
  return lista
})
```

**Experimento:** con el `let`, la caja no acumula. Con la mutación, la pastilla puede no cambiar. Con el `map`, sí cambia.

**Validación:**

- La caja vuelve a guardar lo escrito.
- `marcar` no asigna `item.estado`.
- Problems vacío.

## Comprueba tu entendimiento

**Qué recuerda React**
Recarga después de marcar.
→ La ficha vuelve a pendiente. El estado no es el archivo `datos.ts`.

## Reto

### 1 — push

Dentro de `marcar`, haz `lista.push` de una copia y devuelve `lista`. Mira si la ficha nueva aparece. Quita el `push`.

<details>
<summary>Ver solución</summary>

El mismo array, aunque tenga un elemento más, puede no pintarse. Se entrega un array nuevo: `[...lista, copia]`. En este laboratorio no se añade una ficha: se quita el `push` y se deja el `map`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| La caja no escribe | Sigues en el `let` | `useState` y `setTexto` |
| La pastilla no cambia | La mutación sigue | `{ ...item, estado: "revisado" }` |

## Laboratorio

La demostración comparó un `let` de la caja con el `useState`. Aquí el estado nuevo es un contador de clics.

### Objetivo

Contar cuántas veces se pulsa «Anotar», en un estado distinto de la lista.

### Código de partida

`marcar` copia el objeto con `setItems`. La caja sigue en `useState`.

### Qué haces

1. Añade `const [veces, setVeces] = useState(0)`.
2. Dentro de `marcar`, después de `setItems`, llama a `setVeces((n) => n + 1)`.
3. Pinta `{veces}` bajo el título.
4. Sustituye un momento `useState` por `let veces = 0` y `veces = veces + 1`. Pulsa. Restaura el `useState`.

```tsx
<p>Clics: {veces}</p>
```

→ Con el estado, cada clic sube el número y la pastilla cambia. Con el `let`, la pastilla puede cambiar y el número no se queda. Restaura `useState`.
