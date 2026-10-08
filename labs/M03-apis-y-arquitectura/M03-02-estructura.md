# M03-02 — La estructura

[← Página anterior](M03-01-peticion.md) · [Siguiente página →](../M04-rendimiento/README.md)

> Práctica de [Estructura](02-estructura.md).

### Objetivo

Sacar la lista, la petición y el título de la pestaña de `App`, y dejar en `App` solo el filtro y la composición.

### Código de partida

Si no llegaste a terminar [M03-01](M03-01-peticion.md), deja `bandeja/src/api/entregables.ts` como el archivo de ese laboratorio y sustituye `App.tsx` por este. `Tarjeta.tsx` no se toca: sigue recibiendo `item` y `alMarcar`.

```tsx
import { useEffect, useState } from "react"
import { cargarEntregables } from "./api/entregables"
import type { Entregable } from "./modelo"
import Tarjeta from "./componentes/Tarjeta"

export default function App() {
  const [texto, setTexto] = useState("")
  const [items, setItems] = useState<Entregable[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  const visibles = items.filter((item) => {
    const blob = `${item.titulo} ${item.proveedor} ${item.id}`.toLowerCase()
    return blob.includes(texto.toLowerCase())
  })

  const pendientes = items.filter((item) => item.estado === "pendiente").length

  useEffect(() => {
    document.title = `Pendientes: ${pendientes}`
  }, [pendientes])

  useEffect(() => {
    let vivo = true
    setCargando(true)
    setError("")
    cargarEntregables()
      .then((lista) => {
        if (vivo) setItems(lista)
      })
      .catch((causa: unknown) => {
        console.error(causa)
        if (vivo) setError("No se pudo cargar la bandeja.")
      })
      .finally(() => {
        if (vivo) setCargando(false)
      })
    return () => {
      vivo = false
    }
  }, [])

  function marcar(id: string): void {
    setItems((lista) =>
      lista.map((item) =>
        item.id === id ? { ...item, estado: "revisado" } : item,
      ),
    )
  }

  if (cargando) {
    return (
      <main>
        <h1>Bandeja de entregables</h1>
        <p>Cargando entregables…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1>Bandeja de entregables</h1>
        <p role="alert">{error}</p>
      </main>
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

### En qué consiste

Mover, no reescribir. El experimento deja la petición en el cuerpo del componente para ver una petición por letra, y la devuelve al efecto del hook.

### 1 — El hook

**Dónde:** archivo nuevo `bandeja/src/hooks/useEntregables.ts`.

**Qué haces:**

1. Mueve a ese archivo los estados `items`, `cargando` y `error`, los dos efectos y `marcar`.
2. Devuelve `{ items, cargando, error, marcar }`.
3. En `App`, borra ese bloque y llama al hook. El filtro y los `return` se quedan.
4. Guarda y recarga.

```tsx
import { useEffect, useState } from "react"
import { cargarEntregables } from "../api/entregables"
import type { Entregable } from "../modelo"

export function useEntregables() {
  const [items, setItems] = useState<Entregable[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  const pendientes = items.filter((item) => item.estado === "pendiente").length

  useEffect(() => {
    document.title = `Pendientes: ${pendientes}`
  }, [pendientes])

  useEffect(() => {
    let vivo = true
    setCargando(true)
    setError("")
    cargarEntregables()
      .then((lista) => {
        if (vivo) setItems(lista)
      })
      .catch((causa: unknown) => {
        console.error(causa)
        if (vivo) setError("No se pudo cargar la bandeja.")
      })
      .finally(() => {
        if (vivo) setCargando(false)
      })
    return () => {
      vivo = false
    }
  }, [])

  function marcar(id: string): void {
    setItems((lista) =>
      lista.map((item) =>
        item.id === id ? { ...item, estado: "revisado" } : item,
      ),
    )
  }

  return { items, cargando, error, marcar }
}
```

```tsx
import { useState } from "react"
import Tarjeta from "./componentes/Tarjeta"
import { useEntregables } from "./hooks/useEntregables"

export default function App() {
  const [texto, setTexto] = useState("")
  const { items, cargando, error, marcar } = useEntregables()

  const visibles = items.filter((item) => {
    const blob = `${item.titulo} ${item.proveedor} ${item.id}`.toLowerCase()
    return blob.includes(texto.toLowerCase())
  })

  if (cargando) {
    return (
      <main>
        <h1>Bandeja de entregables</h1>
        <p>Cargando entregables…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1>Bandeja de entregables</h1>
        <p role="alert">{error}</p>
      </main>
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

**Experimento:** en `Tarjeta.tsx`, llama a `fetch("/entregables.json")` en el cuerpo de la función, antes del `return`. Recarga con Network abierto y escribe una letra.

→ Aparece una petición por ficha y otra por cada letra. Borra ese `fetch`. En `Tarjeta.tsx` no queda la palabra `fetch`. En `App.tsx` no queda `useEffect`.

**Validación:**

- Recargar muestra las seis fichas, el filtro y «Pendientes: 3».
- Teclear no repite `entregables.json`.
- `App` calcula `visibles`. No guarda la lista filtrada en otro estado.
- Problems vacío.

## Comprueba tu entendimiento

**Quién decide el filtro**
Busca `texto` en `useEntregables.ts`.
→ No está. El hook no sabe qué hay escrito en la caja. `App` filtra `items`.

## Reto

### 1 — Dos listas

Deja `useState` de `items` también en `App`, además del hook, y pinta el del hook. Marca una ficha.

<details>
<summary>Ver solución</summary>

La ficha cambia porque el `map` usa `items` del hook. El estado duplicado de `App` no se entera. Borra el duplicado: una sola lista, la del hook.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| `cargarEntregables` no se resuelve en el hook | El import sube un nivel de menos | Desde `hooks/` es `../api/entregables` |
| La pestaña no cambia | El efecto del título se quedó en `App` y `pendientes` ya no existe | El efecto vive dentro de `useEntregables` |
| Doble petición al recargar | El efecto sigue en `App` y también en el hook | Solo el del hook |
