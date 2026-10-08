# J03-10 — Separación de responsabilidades

[← Página anterior](J03-09-estructura.md) · [Siguiente página →](J03-11-reutilizable.md)

`App` decide qué fichas se ven. El hook decide cuál es la lista y cuándo llega. `Tarjeta` decide cómo se pinta una ficha y avisa con `alMarcar`. Ninguno hace el trabajo de otro.

## Demostración

### Objetivo

Comprobar que el hook no filtra, que la ficha no pide, y que `App` no guarda la lista.

### Código de partida

El hook devuelve `{ items, cargando, error, marcar }`. `App` calcula `visibles` y pinta. `Tarjeta` recibe `item` y `alMarcar`. Pega estos archivos si no es así.

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

`bandeja/src/hooks/useEntregables.ts`

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

`bandeja/src/App.tsx`

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

Tres búsquedas y un experimento que se deshace.

### 1 — Tres sitios, tres trabajos

**Dónde:** `useEntregables.ts`, `Tarjeta.tsx` y `App.tsx`.

**Qué haces:**

1. Busca `texto` en el hook.
2. Busca `fetch` en `Tarjeta.tsx`.
3. Busca `useState` de la lista en `App.tsx`.
4. Anota las tres.

**Experimento:** en el cuerpo de `Tarjeta`, antes del `return`, añade `void fetch("/entregables.json")`. Recarga con Network abierto. Escribe una letra en «Buscar». Borra esa línea.

→ Una petición por ficha al cargar, y otra por cada letra. Al borrar la línea, la petición vuelve a ser una, al recargar. `Tarjeta` otra vez solo pinta.

**Validación:**

- `texto` no está en el hook.
- `fetch` no está en `Tarjeta.tsx`.
- `App` no tiene `useState` de `items`. Lo recibe del hook.
- Teclear no repite `entregables.json`.

## Comprueba tu entendimiento

**Quién filtra**
Cambia el filtro para que también mire `item.estado`. Escribe `pendiente`.
→ Lo hace `App`, en `visibles`. El hook sigue devolviendo las seis cuando la caja está vacía. Puedes dejar el filtro como estaba, solo título, proveedor e id.

## Reto

### 1 — La ficha decide el estado

Dentro de `Tarjeta`, cambia la pastilla para que siempre escriba `ok`, sin leer `item.estado`. Marca E-101. Restaura `{item.estado}`.

<details>
<summary>Ver solución</summary>

El botón pasa a «Hecho» y la pastilla sigue diciendo `ok`. La ficha ha dejado de contar el dato. La pastilla vuelve a `{item.estado}`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Petición por letra | El `fetch` de prueba sigue en `Tarjeta` | Bórralo. La petición vive en `api/entregables.ts` |
| El filtro no responde | `visibles` se calcula en el hook y no recibe `texto` | El `filter` está en `App`, después de `useState("")` |

## Laboratorio

La demostración sacó un `fetch` de `Tarjeta`. Aquí el fallo es otro: la ficha decide qué lista existe.

### Objetivo

Ver que `Tarjeta` no puede filtrar la bandeja, y devolver el filtro a `App`.

### Código de partida

`App` calcula `visibles`. `Tarjeta` recibe un `item`. No hay `fetch` en la ficha.

### Qué haces

1. Pasa un momento la caja a `Tarjeta`: un `useState("")` dentro de la ficha y un input.
2. Escribe `Norte` en la primera ficha.
3. Las otras cinco siguen en pantalla. Cada ficha tiene su propia caja.
4. Borra ese estado y ese input de `Tarjeta`. La caja única vuelve a `App`.

→ Una caja por ficha no es la bandeja. Al restituir el input de `App`, `Norte` esconde las fichas que no coinciden. `Tarjeta` otra vez solo pinta el `item` que le llega.
