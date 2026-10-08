# J01-06 — Props

[← Página anterior](J01-05-componentes.md) · [Siguiente página →](J01-07-eventos.md)

Una prop es un argumento. `item` es obligatorio. `textoBoton` puede faltar: el defecto es `"Anotar"`. La prop viaja de `App` a `Tarjeta`. La ficha no importa `datos.ts`. `key` va en el `<li>` del `map` y es `item.id`.

## Demostración

### Objetivo

Ver que `item` es obligatorio, que `textoBoton` tiene defecto y que `key` es el id.

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

### 1 — Quitar y devolver la prop

**Dónde:** `App.tsx`, la etiqueta del `map`. `key` sigue en el `<li>`.

**Qué haces:**

1. Quita `item={item}`. Lee Problems. Vuelve a ponerlo.
2. Añade `textoBoton="Registrar"` solo en esa etiqueta. Lee E-101.
3. Quita `textoBoton`.
4. Pasa `key` al `<Tarjeta>` y quítalo del `<li>`. Mira la consola. Devuelve `key={item.id}` al `<li>`.

**Experimento:** confirma en qué fichas se lee «Falta revisión».

→ Sin `item`, no compila. Con `textoBoton`, el botón de una ficha pendiente dice «Registrar» y el id. Sin el atributo, «Anotar». «Falta revisión» está en E-101, E-103 y E-105.

**Validación:**

- Problems vacío.
- `key` está en el `<li>`.
- `Tarjeta.tsx` no importa `datos.ts`.

## Comprueba tu entendimiento

**La prop sobrante**
Pasa `item={{ ...item, urgente: true }}`.
→ Problems marca `urgente`. Vuelve a `item={item}`.

## Reto

### 1 — El índice como key

Cambia `key={item.id}` por el índice del `map`. Compila. Vuelve al id.

<details>
<summary>Ver solución</summary>

El índice es `number` y compila. No se deja: al filtrar, la posición de una ficha cambia. La `key` del curso es `item.id`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| El botón sale vacío | No está `= "Anotar"` | El defecto va en el parámetro |
| Aviso de `key` | `key` quedó dentro de `Tarjeta` | `key={item.id}` en el `<li>` |

## Laboratorio

La demostración cambió `textoBoton`. Aquí añades otra prop, de tipo distinto.

### Objetivo

Marcar visualmente solo las fichas pendientes, con un booleano.

### Código de partida

`Tarjeta` recibe `item` y `textoBoton?`. `App` la usa en el `map`.

### Qué haces

1. Añade `urgente?: boolean` a `TarjetaProps` y a los parámetros.
2. Si `urgente` es verdadero, un párrafo «Urgente».
3. En el `map`, pásalo solo cuando el estado es `pendiente`.
4. Quita la prop. El párrafo desaparece. Puedes dejarla.

```tsx
urgente?: boolean
```

```tsx
{urgente ? <p>Urgente</p> : null}
```

```tsx
<Tarjeta
  item={item}
  alMarcar={marcar}
  urgente={item.estado === "pendiente"}
/>
```

→ E-101, E-103 y E-105 dicen «Urgente». E-102 no. Sin la prop, ninguna lo dice. `textoBoton` no ha cambiado.
