# J01-05 — Componentes

[← Página anterior](J01-04-jsx.md) · [Siguiente página →](J01-06-props.md)

`Tarjeta` es una función en su propio archivo. `App` la usa y no dibuja la ficha. Las seis salen de un `map` sobre el mismo componente. No hay clases: la función no extiende `Component`.

## Demostración

### Objetivo

Comprobar que las seis fichas salen de una función `Tarjeta`, y que `App` solo la usa.

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

### 1 — Una función, varias fichas

**Dónde:** `Tarjeta.tsx` y `App.tsx`.

**Qué haces:**

1. Cuenta cuántas veces aparece `function Tarjeta` en el proyecto. Tiene que ser una.
2. Cambia el título de la ficha a `{item.proveedor}`. Guarda.
3. Lee las seis fichas.
4. Restaura `{item.titulo}`.

**Experimento:** en `Tarjeta.tsx`, cambia el import del tipo a `./modelo`. Guarda. Restáuralo a `../modelo`.

→ Las fichas muestran el proveedor y luego otra vez el título. `./modelo` no resuelve: el archivo está dentro de `componentes/`. `../modelo` sí.

**Validación:**

- Un solo `Tarjeta.tsx`.
- `App` no contiene el `<article>` de la ficha.
- Problems vacío.

## Comprueba tu entendimiento

**Componente y elemento**
`Tarjeta` es la función. El `<h1>` de `App` es un elemento.
→ La función se importa. El `<h1>` se escribe donde se pinta.

## Reto

### 1 — App sin la ficha

Borra el import de `Tarjeta` y deja el `<Tarjeta />` en el `map`. Lee el aviso. Restaura el import.

<details>
<summary>Ver solución</summary>

`Tarjeta` no está definido. La página puede quedar en blanco. El import `./componentes/Tarjeta` lo resuelve.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Seis funciones copiadas | El marcado está repetido en `App` | Un `map` y un solo archivo |
| No resuelve `modelo` | El import no sube de carpeta | `../modelo` |

## Laboratorio

La demostración usó una sola `Tarjeta` en el `map`. Aquí partes la pastilla en otro componente.

### Objetivo

Que `Tarjeta` no dibuje la pastilla: la dibuja `Pastilla`.

### Código de partida

`Tarjeta` tiene `<p className={\`estado ${item.estado}\`}>{item.estado}</p>`.

### Qué haces

1. Crea `bandeja/src/componentes/Pastilla.tsx`.
2. En `Tarjeta`, sustituye ese `<p>` por `<Pastilla estado={item.estado} />`.
3. Recarga. Las pastillas se leen igual.
4. Puedes dejar `Pastilla`.

```tsx
export default function Pastilla({ estado }: { estado: string }) {
  return <p className={`estado ${estado}`}>{estado}</p>
}
```

→ Sigue habiendo un `map` y un solo `Tarjeta.tsx`. La palabra `pendiente` sale de `Pastilla`, no de un `<p>` escrito en `Tarjeta`.
