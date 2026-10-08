# J03-09 — Estructura del proyecto

[← Página anterior](J03-08-finales.md) · [Siguiente página →](J03-10-responsabilidades.md)

La petición vive en `api/`. La lista, la carga, el error y `marcar` viven en `useEntregables`. `App` calcula el filtro y pinta. `Tarjeta` pinta una ficha.

## Demostración

### Objetivo

Dejar la petición, la lista y el título de la pestaña en `useEntregables`, y en `App` solo el filtro y el JSX.

### Código de partida

`App` pide el JSON, distingue carga, error y vacío, y filtra. El hook todavía no existe. Pega la API y `App` si no es así.

`bandeja/src/api/entregables.ts`

```tsx
import type { Entregable, EstadoEntregable } from "../modelo"

function esEstado(valor: unknown): valor is EstadoEntregable {
  return valor === "pendiente" || valor === "revisado" || valor === "rechazado"
}

function esEntregable(valor: unknown): valor is Entregable {
  if (typeof valor !== "object" || valor === null) return false
  const candidato = valor as Record<string, unknown>
  return (
    typeof candidato.id === "string" &&
    typeof candidato.titulo === "string" &&
    typeof candidato.proveedor === "string" &&
    esEstado(candidato.estado)
  )
}

export async function cargarEntregables(): Promise<Entregable[]> {
  const respuesta = await fetch("/entregables.json")
  if (!respuesta.ok) throw new Error(`Respuesta ${respuesta.status}`)
  const datos: unknown = await respuesta.json()
  if (!Array.isArray(datos) || !datos.every(esEntregable)) {
    throw new Error("El JSON no es una lista de entregables")
  }
  return datos
}
```

`bandeja/src/App.tsx`

```tsx
import { useEffect, useState } from "react"
import type { Entregable } from "./modelo"
import Tarjeta from "./componentes/Tarjeta"
import { cargarEntregables } from "./api/entregables"

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

### En qué consiste

Mover el bloque, no reescribir la bandeja. Al final el árbol coincide con el de la guía.

### 1 — El hook

**Dónde:** archivo nuevo `bandeja/src/hooks/useEntregables.ts`.

**Qué haces:**

1. Crea el archivo con este contenido.
2. En `App.tsx`, borra `items`, `cargando`, `error`, los dos efectos y `marcar`.
3. Sustituye la cabecera de `App` por la de abajo.
4. Los `return` de carga, error y lista se quedan.
5. Recarga.

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
```

El `filter` de `visibles` y los tres `return` no se mueven.

**Experimento:** deja una copia de `useEffect` de la petición también en `App`. Recarga y mira Network.

→ Dos peticiones a `entregables.json`. Borra la copia de `App`. Vuelve a haber una.

**Validación:**

- El árbol tiene `api/entregables.ts`, `hooks/useEntregables.ts`, `componentes/Tarjeta.tsx` y `App.tsx`.
- En `App.tsx` no aparece `useEffect` ni `fetch`.
- Al recargar: seis fichas, filtro, pestaña «Pendientes: 3».
- Problems vacío.

## Comprueba tu entendimiento

**Qué archivo abre un revisor**
Para saber de dónde sale la lista, abre un archivo.
→ `hooks/useEntregables.ts`. `App.tsx` solo calcula `visibles`.

## Reto

### 1 — El import que no resuelve

En el hook, cambia `../api/entregables` por `./api/entregables`. Lee el aviso. Restáuralo.

<details>
<summary>Ver solución</summary>

El hook está dentro de `hooks/`. La API está un nivel arriba. El import es `../api/entregables`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| La pestaña no tiene número | El efecto del título se quedó en `App` y `pendientes` ya no existe | El efecto vive en el hook |
| Doble petición | El efecto está en los dos archivos | Solo el del hook |
| `cargarEntregables` no se encuentra | El import no sube de carpeta | `../api/entregables` |

## Laboratorio

La demostración movió la petición a `useEntregables`. Aquí el título de la pestaña sale a otro hook, y la petición no lo acompaña.

### Objetivo

`useTitulo(pendientes)` solo escribe `document.title`. No llama a `fetch`.

### Código de partida

`useEntregables` existe y todavía contiene el efecto del título. Si no existe, la demostración de esta página trae el archivo.

### Qué haces

1. Crea `bandeja/src/hooks/useTitulo.ts`.
2. Quita el efecto del título de `useEntregables`. Calcula `pendientes` en `App` o déjalo en el hook y pásalo.
3. Llama a `useTitulo` desde `App` o desde `useEntregables`, una sola vez.
4. Marca E-101. La pestaña baja. En `useTitulo.ts` no está la palabra `fetch`.

```tsx
import { useEffect } from "react"

export function useTitulo(pendientes: number): void {
  useEffect(() => {
    document.title = `Pendientes: ${pendientes}`
  }, [pendientes])
}
```

→ La pestaña dice «Pendientes: 3» al recargar y baja al marcar. La petición sigue en `useEntregables` o en `api/`, no en `useTitulo.ts`.
