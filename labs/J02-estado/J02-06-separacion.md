# J02-06 — Lógica y presentación

[← Página anterior](J02-05-flujo.md) · [Siguiente página →](../J03-integracion/README.md)

`Tarjeta` sabe cómo se ve una ficha. No sabe cuál es la lista ni qué título debe llevar la pestaña. Esa lógica sale de `App` a `useLista`. El hook lee `datos.ts`. La petición HTTP es otro tema.

## Demostración

### Objetivo

Sacar `items`, `marcar` y el título de la pestaña a `useLista`, y dejar en `App` el filtro y el JSX.

### Código de partida

La lista sale de `datos.ts`, no de `fetch`. La pestaña dice «Pendientes: 3». Pega `App.tsx` si falta el efecto.

`bandeja/src/App.tsx`

```tsx
import { useEffect, useState } from "react"
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

  const pendientes = items.filter((item) => item.estado === "pendiente").length

  useEffect(() => {
    document.title = `Pendientes: ${pendientes}`
  }, [pendientes])

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

### 1 — El hook de la lista

**Dónde:** archivo nuevo `bandeja/src/hooks/useLista.ts`.

**Qué haces:**

1. Mueve `items`, `marcar`, `pendientes` y el efecto.
2. Devuelve `{ items, marcar }`.
3. `App` llama al hook y se queda el filtro.
4. Recarga.

```tsx
import { useEffect, useState } from "react"
import { entregables } from "../datos"
import type { Entregable } from "../modelo"

export function useLista() {
  const [items, setItems] = useState<Entregable[]>(entregables)

  const pendientes = items.filter((item) => item.estado === "pendiente").length

  useEffect(() => {
    document.title = `Pendientes: ${pendientes}`
  }, [pendientes])

  function marcar(id: string): void {
    setItems((lista) =>
      lista.map((item) =>
        item.id === id ? { ...item, estado: "revisado" } : item,
      ),
    )
  }

  return { items, marcar }
}
```

```tsx
import { useState } from "react"
import Tarjeta from "./componentes/Tarjeta"
import { useLista } from "./hooks/useLista"

export default function App() {
  const [texto, setTexto] = useState("")
  const { items, marcar } = useLista()
```

El `filter` y el `return` de `App` no cambian de sitio.

**Experimento:** deja también `useState(entregables)` en `App` y pinta el del hook. Marca una ficha. Borra el estado duplicado.

→ La ficha cambia porque el `map` usa el hook. El estado de `App` no se entera. Al borrarlo, queda una lista. `Tarjeta` sigue sin `useState`. El hook sigue sin `className`.

**Validación:**

- Al recargar, seis fichas, filtro y «Pendientes: 3».
- `App.tsx` no tiene `useEffect`.
- Problems vacío.

## Comprueba tu entendimiento

**Quién conoce el filtro**
Busca `texto` en `useLista.ts`.
→ No está. El hook no sabe qué hay escrito en la caja.

## Reto

### 1 — className en el hook

Pinta un `className` dentro de `useLista` y mira el aviso. Quítalo.

<details>
<summary>Ver solución</summary>

El hook no devuelve interfaz. `className` vive en `Tarjeta`. El hook devuelve datos y `marcar`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| No encuentra `datos` | El import no sube de carpeta | Desde `hooks/` es `../datos` |
| Dos listas | El `useState` sigue en `App` | Solo el del hook |

## Laboratorio

La demostración sacó la lista a `useLista`. Aquí sacas solo la caja a otro componente. La lista no se mueve.

### Objetivo

`Buscador` pinta la etiqueta y el input. No conoce `items`.

### Código de partida

`App` tiene `texto`, `setTexto` y el input `#filtro`. `useLista`, si existe, se queda.

### Qué haces

1. Crea `bandeja/src/componentes/Buscador.tsx`.
2. Sustituye el `<label>` y el `<input>` de `App` por `<Buscador texto={texto} alCambiar={setTexto} />`.
3. Escribe `Norte`. El filtro responde.
4. Busca `items` en `Buscador.tsx`. No está.

```tsx
interface BuscadorProps {
  texto: string
  alCambiar: (valor: string) => void
}

export default function Buscador({ texto, alCambiar }: BuscadorProps) {
  return (
    <>
      <label htmlFor="filtro">Buscar</label>
      <input
        id="filtro"
        value={texto}
        onChange={(evento) => alCambiar(evento.target.value)}
      />
    </>
  )
}
```

→ `Norte` sigue filtrando. `Buscador` no importa `datos.ts` ni llama a `setItems`. El estado del texto sigue en `App`.
