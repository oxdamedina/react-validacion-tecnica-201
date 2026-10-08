# J03-05 — useStore

[← Página anterior](J03-04-reducer.md) · [Siguiente página →](J03-06-ciclo.md)

`useStore` es un hook de este curso, no una librería. Junta el reductor de la lista y el nombre del revisor en un contexto. `App` y `Tarjeta` lo leen. Fuera de `TiendaProveedor` el hook lanza.

## Demostración

### Objetivo

Leer la lista, `marcar` y el revisor con `useStore()`, sin `useReducer` ni `useContext` en `App` ni en `Tarjeta`.

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

Esta página sustituye esos dos archivos. No hace falta tener ya el contexto ni el reductor: el archivo de la tienda, más abajo, los trae.

### 1 — La tienda

**Dónde:** archivo nuevo `bandeja/src/tienda.tsx`. `main.tsx`, `App.tsx` y `Tarjeta.tsx`.

**Qué haces:**

1. Crea la tienda con el reductor, el revisor y `useStore`.
2. En `main.tsx`, sustituye `SesionProveedor` por `TiendaProveedor`.
3. `App` pide `items`, `revisor` y `setRevisor` a `useStore()`. Quita de `App` el `useReducer`, el `useState` de la lista y `useSesion`.
4. `Tarjeta` pide `marcar` y `revisor` a `useStore()`. Quita la prop `alMarcar`.
5. Escribe `Luis` y pulsa «Anotar E-101».

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react"
import { entregables } from "./datos"
import type { Entregable } from "./modelo"

type Accion = { type: "marcar"; id: string }

function reducir(lista: Entregable[], accion: Accion): Entregable[] {
  switch (accion.type) {
    case "marcar":
      return lista.map((item) =>
        item.id === accion.id ? { ...item, estado: "revisado" } : item,
      )
  }
}

interface Tienda {
  items: Entregable[]
  marcar: (id: string) => void
  revisor: string
  setRevisor: (nombre: string) => void
}

const TiendaContexto = createContext<Tienda | null>(null)

export function TiendaProveedor({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducir, entregables)
  const [revisor, setRevisor] = useState("Ana")
  const marcar = useCallback((id: string) => {
    dispatch({ type: "marcar", id })
  }, [])
  const valor = useMemo(
    () => ({ items, marcar, revisor, setRevisor }),
    [items, marcar, revisor],
  )
  return <TiendaContexto.Provider value={valor}>{children}</TiendaContexto.Provider>
}

export function useStore(): Tienda {
  const tienda = useContext(TiendaContexto)
  if (!tienda) throw new Error("useStore fuera de TiendaProveedor")
  return tienda
}
```

```tsx
const { items, revisor, setRevisor } = useStore()
```

En `Tarjeta`, dentro de la función:

```tsx
const { marcar, revisor } = useStore()
```

El botón llama a `marcar(item.id)`. La etiqueta en `App` queda `<Tarjeta item={item} />`, sin `alMarcar`. Borra `alMarcar` de `TarjetaProps`.

**Experimento:** quita `<TiendaProveedor>` y recarga. Vuelve a ponerlo.

→ `Luis` cambia las seis líneas «Revisor:». E-101 pasa a `revisado` y E-103 no. Sin el proveedor, se lee «useStore fuera de TiendaProveedor». `App.tsx` y `Tarjeta.tsx` no importan `useReducer` ni `useContext`.

**Validación:**

- `useStore` está en `tienda.tsx`.
- Problems vacío.
- El filtro de `App` sigue calculando `visibles` a partir de `items`.
- `Sesion.tsx` puede quedarse sin uso. Si el editor lo marca, bórralo: la tienda ocupa su sitio.

## Comprueba tu entendimiento

**Qué es useStore**
No viene de React. Es el hook de este archivo.
→ Por dentro llama a `useContext`. El `useReducer` vive en el proveedor, una sola vez.

## Reto

### 1 — Leer la tienda en un sitio de más

Llama a `useStore()` también dentro de `reducir`.
→ No se puede: `reducir` no es un componente. Borra esa llamada. El reductor solo recibe la lista y la acción.

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| `useStore fuera de TiendaProveedor` | El proveedor no envuelve `<App />` | Está en `main.tsx`, dentro de `StrictMode` |
| `alMarcar` no existe | La prop se borró y el botón aún la nombra | El botón llama a `marcar` de `useStore()` |
| Dos listas | `useState(entregables)` sigue en `App` | `items` sale solo de `useStore()` |

## Laboratorio

La demostración leyó la lista y el revisor con `useStore`. Aquí el store guarda un número que no es una ficha: cuántos avisos llevas.

### Objetivo

`avisos` y `sumar` viven en la tienda. El `<h1>` los lee. `Tarjeta` no recibe esa prop.

### Código de partida

`useStore` ya devuelve `items` y `marcar`. Si no existe `tienda.tsx`, la demostración de esta página trae el archivo entero: pégalo antes.

### Qué haces

1. En la interfaz `Tienda` y en el proveedor, añade `avisos` con `useState(0)` y `sumar`.
2. Mételos en el `useMemo`.
3. En `App`, lee `avisos` y `sumar`. Un botón «Aviso» llama a `sumar`.
4. Pulsa dos veces. El título cambia. `TarjetaProps` no tiene `avisos`.

```tsx
const [avisos, setAvisos] = useState(0)
const sumar = useCallback(() => setAvisos((n) => n + 1), [])
```

El `useMemo` incluye `avisos` y `sumar`.

```tsx
const { avisos, sumar } = useStore()
```

```tsx
<h1>Bandeja de entregables ({avisos})</h1>
<button type="button" onClick={sumar}>Aviso</button>
```

→ Dos clics dejan «Bandeja de entregables (2)». Marcar E-101 no sube ese número. `sumar` no está en las props de `Tarjeta`.
