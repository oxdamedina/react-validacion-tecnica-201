# J03-04 — useReducer

[← Página anterior](J03-03-memo.md) · [Siguiente página →](J03-05-store.md)

El reductor recibe la lista de ahora y una acción, y devuelve la lista siguiente. La acción es `{ type: "marcar", id }`. `marcar` deja de escribir el `map` y solo hace `dispatch`.

## Demostración

### Objetivo

Cambiar la lista con una acción `{ type: "marcar", id }` en vez de un `setItems` escrito a mano.

### Código de partida

La lista es `useState(entregables)` y `marcar` usa `setItems`. Pega `App.tsx` si el tuyo ya está en un reductor o en una tienda y quieres ver solo este tema.

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

### 1 — Estado, acción, estado siguiente

**Dónde:** `App.tsx`, o `useLista.ts` si la lista ya está ahí. Encima del componente.

**Qué haces:**

1. Declara la acción y `reducir`.
2. Sustituye `useState` de `items` por `useReducer`.
3. `marcar` solo hace `dispatch`.
4. Pulsa «Anotar E-101» y mira E-103.

```tsx
import { useReducer, useState } from "react"
import type { Entregable } from "./modelo"
```

Si el reductor está en `hooks/useLista.ts`, el import del tipo es `../modelo`.

```tsx
type Accion = { type: "marcar"; id: string }

function reducir(lista: Entregable[], accion: Accion): Entregable[] {
  switch (accion.type) {
    case "marcar":
      return lista.map((item) =>
        item.id === accion.id ? { ...item, estado: "revisado" } : item,
      )
  }
}
```

```tsx
const [items, dispatch] = useReducer(reducir, entregables)

function marcar(id: string): void {
  dispatch({ type: "marcar", id })
}
```

**Experimento:** cambia un momento la acción a `{ type: "marcar", id: "E-101" }` fijo, sin usar el argumento. Pulsa E-103. Restaura `id`.

→ Con el id del argumento, E-101 pasa a `revisado` y E-103 no. Con el id fijo, cualquier clic marca E-101. El `type` que no está en `Accion` no compila. Se deja `"marcar"`.

**Validación:**

- No queda `setItems` de la lista.
- El botón de `Tarjeta` sigue llamando a `alMarcar(item.id)`.
- Problems vacío.

## Comprueba tu entendimiento

**Qué devuelve el reductor**
Un array nuevo, no el mismo con un campo mutado.
→ El `map` copia el objeto de ese id. El resto de elementos se reaprovechan.

## Reto

### 1 — Otra acción

Añade `{ type: "restaurar" }` y un `case` que devuelva `entregables`. Un botón «Restaurar» la dispara. Puedes dejarlo.

<details>
<summary>Ver solución</summary>

```tsx
type Accion = { type: "marcar"; id: string } | { type: "restaurar" }
```

```tsx
case "restaurar":
  return entregables
```

Tras marcar, «Restaurar» devuelve las seis al estado del archivo. `marcar` no se entera del botón: solo despacha su acción.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| `setItems` no existe | El resto del archivo aún lo llama | La lista solo cambia con `dispatch` |
| Un clic marca otra ficha | El `dispatch` cierra sobre un id fijo | `dispatch({ type: "marcar", id })` con el argumento |
| El `switch` no cubre el tipo | Falta el `case` o sobra un `return` implícito | Cada `type` de `Accion` tiene su `case` y devuelve la lista |

## Laboratorio

La demostración despachó `{ type: "marcar", id }`. Aquí añades otra acción que vacía la lista.

### Objetivo

Un botón «Vaciar» que despacha `{ type: "vaciar" }` y el reductor devuelve `[]`.

### Código de partida

`App` usa `useReducer(reducir, entregables)` y `marcar` hace `dispatch({ type: "marcar", id })`. Si todavía es `setItems`, termina antes la demostración de esta página: el archivo del reductor está arriba.

### Qué haces

1. Amplía el tipo y añade el `case`.
2. Un botón despacha la acción. No llama a `setItems`.
3. Marca E-101. Pulsa «Vaciar». No queda ninguna ficha.
4. Recarga. Vuelven las seis, porque el estado inicial es `entregables`.

```tsx
type Accion = { type: "marcar"; id: string } | { type: "vaciar" }
```

```tsx
case "vaciar":
  return []
```

```tsx
<button type="button" onClick={() => dispatch({ type: "vaciar" })}>
  Vaciar
</button>
```

→ Tras vaciar, el párrafo de «ningún entregable» o la lista vacía. E-103 no se queda en pantalla. El reductor no ha llamado a `fetch`.
