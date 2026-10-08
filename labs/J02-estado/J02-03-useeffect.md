# J02-03 — useEffect

[← Página anterior](J02-02-usestate.md) · [Siguiente página →](J02-04-ciclo.md)

`useEffect` corre después de pintar, y otra vez cuando cambian las dependencias. Sirve para hablar con algo de fuera: el título de la pestaña. No sirve para calcular `visibles`. Eso sigue siendo un `const`. `[]` significa solo al montar. Si `pendientes` cambia y no está en el array, el título se queda en el primer número.

## Demostración

### Objetivo

Llevar el número de pendientes al título de la pestaña, y ver qué pasa si las dependencias mienten.

### Código de partida

La pestaña dice «Bandeja de entregables». No hay `useEffect`. Pega `App.tsx`. `Tarjeta` es la de abajo.

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

### 1 — El título de la pestaña

**Dónde:** `App.tsx`, después de `visibles`. El import pasa a `import { useEffect, useState } from "react"`.

**Qué haces:**

1. Calcula `pendientes` desde `items`.
2. Añade el efecto con `[pendientes]`.
3. Mira la pestaña del navegador, no el `<h1>`.

```tsx
const pendientes = items.filter((item) => item.estado === "pendiente").length

useEffect(() => {
  document.title = `Pendientes: ${pendientes}`
}, [pendientes])
```

**Experimento:**

1. Escribe `Sur`. Lee la pestaña y cuenta fichas.
2. Borra el filtro. Marca E-101. Lee la pestaña.
3. Cambia el array a `[]`. Recarga. Marca una ficha. Lee la pestaña.
4. Devuelve `[pendientes]`.

→ Con `Sur`, la pestaña sigue en «Pendientes: 3». Al marcar, baja a 2. Con `[]`, se queda en 3. Con `[pendientes]`, acompaña a la pastilla.

**Validación:**

- Al recargar, la pestaña dice «Pendientes: 3».
- `pendientes` no sale de `visibles`.
- Problems vacío.

## Comprueba tu entendimiento

**El efecto no filtra**
`visibles` sigue fuera del efecto.
→ Teclear sigue filtrando aunque el efecto solo escriba el título.

## Reto

### 1 — Sin array

Quita el segundo argumento del `useEffect`. Teclea. Devuelve `[pendientes]`.

<details>
<summary>Ver solución</summary>

El efecto corre en cada letra. El título no cambia porque el número no cambió, pero el contrato ha desaparecido. Se deja `[pendientes]`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| `useEffect is not defined` | El import no lo nombra | `import { useEffect, useState } from "react"` |
| El título no baja | Dependencias `[]` | `[pendientes]` |
| Miras el h1 | El número está en la pestaña | Lee la pestaña del navegador |

## Laboratorio

La demostración escribió el número de pendientes en la pestaña. Aquí el efecto escribe en la consola cuando cambia el texto, no el título.

### Objetivo

Un efecto que dependa de `texto` y no toque `document.title`.

### Código de partida

El efecto del título, si está, se queda con `[pendientes]`. No lo borres.

### Qué haces

1. Añade este segundo efecto debajo del primero.
2. Escribe `Norte`. Mira la consola, no la pestaña.
3. Cambia las dependencias a `[]`. Escribe otra letra. La consola no repite.
4. Borra este segundo efecto. El del título se queda.

```tsx
useEffect(() => {
  console.log(`Buscar: ${texto}`)
}, [texto])
```

→ Cada letra escribe «Buscar: …». La pestaña no cambia por este efecto. Con `[]` solo sale el mensaje del montaje. Al borrar el efecto, la consola calla y «Pendientes: 3» sigue en la pestaña.
