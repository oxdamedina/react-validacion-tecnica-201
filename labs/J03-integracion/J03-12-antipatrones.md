# J03-12 — Antipatrones

[← Página anterior](J03-11-reutilizable.md) · [Siguiente página →](../J04-rendimiento/README.md)

Mutar el mismo objeto y devolver el mismo array a veces no repinta. Guardar `visibles` en otro estado separa la caja de las fichas. Leer el JSON como `any` apaga el guarda.

## Demostración

### Objetivo

Provocar tres fallos de arquitectura, leerlos y dejar el código como estaba.

### Código de partida

La lista llega por `useEntregables`. `marcar` copia el objeto. `visibles` es un `const` en `App`. Pega estos archivos si no es así.

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

Tres experimentos. Ninguno se queda.

### 1 — Mutar el mismo objeto

**Dónde:** `marcar`, dentro de `useEntregables.ts`.

**Qué haces:**

1. Sustituye el cuerpo por una mutación.
2. Recarga y pulsa «Anotar E-103».
3. Restaura el `map`.

```tsx
function marcar(id: string): void {
  setItems((lista) => {
    lista.forEach((item) => {
      if (item.id === id) item.estado = "revisado"
    })
    return lista
  })
}
```

**Experimento:** mira la pastilla de E-103.

→ Si no cambia, React ha recibido el mismo array. Restaura:

```tsx
function marcar(id: string): void {
  setItems((lista) =>
    lista.map((item) =>
      item.id === id ? { ...item, estado: "revisado" } : item,
    ),
  )
}
```

Pulsa otra vez. La pastilla pasa a `revisado`.

### 2 — Dos verdades para el filtro

**Dónde:** `App.tsx`, el cálculo de `visibles`.

**Qué haces:**

1. Guárdalo en un estado que solo se rellena una vez.
2. Escribe `Este`.
3. Vuelve al `const` calculado.

```tsx
const [visibles] = useState(items)
```

**Experimento:** la caja muestra `Este` y las fichas no se mueven, o se mueven solo en el primer pintado.

→ Hay dos datos: el texto y una lista que nadie actualiza. Borra ese `useState`. `visibles` vuelve a ser el `filter` de `items` y `texto`. `Este` deja «Inventario de componentes».

### 3 — any en el guarda

**Dónde:** `api/entregables.ts`, la línea `const datos: unknown`.

**Qué haces:**

1. Cámbiala a `any`.
2. En el JSON, E-104 pasa a `"listo"`.
3. Recarga.
4. Restaura `unknown` y `"rechazado"`.

→ Con `any`, el `every` deja de proteger y `"listo"` puede colar. Con `unknown`, la lista se rechaza. Al restaurar, vuelven las seis.

**Validación:**

- `marcar` copia el objeto.
- `visibles` no es un estado.
- No queda `any`.
- Problems vacío.

## Comprueba tu entendimiento

**El síntoma de cada uno**
Mutar no repinta, el estado duplicado no filtra, `any` no avisa.
→ Son tres sitios distintos: el hook, `App` y `api/entregables.ts`.

## Reto

### 1 — El efecto que copia el filtro

Calcula `visibles` con un `useEffect` que haga `setVisibles`. Escribe una letra. Quita ese efecto.

<details>
<summary>Ver solución</summary>

La lista va un pintado por detrás de la caja, o pide otra vuelta. El filtro se calcula mientras se pinta. El efecto y el estado sobrante se borran.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| La pastilla no vuelve | La mutación sigue en `marcar` | Restaura el `map` con `{ ...item, estado: "revisado" }` |
| El filtro sigue muerto | Quedó `useState(items)` | `const visibles = items.filter(...)` |
| `"listo"` entra | `datos` sigue en `any` | `const datos: unknown` |

## Laboratorio

La demostración mutó el objeto, duplicó `visibles` y apagó el guarda con `any`. Aquí el fallo es la `key`.

### Objetivo

Usar el índice como `key`, filtrar, y ver que React reutiliza la ficha equivocada. Después volver a `item.id`.

### Código de partida

El `map` está en `App` con `key={item.id}`. Hay caja de filtro.

### Qué haces

1. En `Tarjeta`, añade un `useState("")` y un input «Nota», solo para este ejercicio.
2. Escribe `hola` en la nota de la primera ficha.
3. Cambia la `key` a `index`. Escribe `zzzz` y borra. Mira en qué ficha quedó `hola`.
4. Restaura `key={item.id}`. Repite. `hola` sigue en la primera ficha, la del informe.
5. Borra el input de la nota.

```tsx
{visibles.map((item, index) => (
  <li key={index}>
    <Tarjeta item={item} alMarcar={marcar} />
  </li>
))}
```

→ Con el índice, la nota se pega a la posición y no al entregable. Con `item.id`, la nota viaja con E-101. La `key` definitiva es `item.id`.
