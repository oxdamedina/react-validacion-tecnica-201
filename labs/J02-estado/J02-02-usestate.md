# J02-02 — useState

[← Página anterior](J02-01-state.md) · [Siguiente página →](J02-03-useeffect.md)

`texto` es el valor de ahora y `setTexto` pide el siguiente. La caja muestra `texto` y, al escribir, llama a `setTexto`. `visibles` se calcula con `items` y `texto`. No es otro estado: si se guarda aparte, la caja y las fichas se separan.

## Demostración

### Objetivo

Tener la caja y el filtro en estado, y la lista visible calculada.

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

Si la caja ya filtra, sigue al experimento. Si no, estos dos archivos dejan la bandeja en ese punto.

### 1 — Filtrar sin un segundo estado

**Dónde:** la caja y `datos.ts`.

**Qué haces:**

1. Escribe `Norte`. Cuenta fichas.
2. Borra. Cuentan seis.
3. Escribe `zzzz`.
4. Abre `datos.ts` y cuenta objetos. No lo edites.

**Experimento:** guarda `visibles` en otro `useState(items)` y no lo actualices. Escribe `Norte`. Restaura el `const`.

→ Con el `const`, `Norte` deja las fichas de ese proveedor y `zzzz` muestra «Ningún entregable coincide.». `datos.ts` sigue con seis. Con el segundo estado, la caja cambia y las fichas no.

**Validación:**

- El input tiene `id="filtro"` y `value={texto}`.
- El `map` recorre `visibles`.
- No hay un `useState` para la lista filtrada.

## Comprueba tu entendimiento

**De dónde sale el tipo**
`useState("")` fija `texto` como `string`.
→ `setTexto(1)` lo marca Problems. No dejes ese número.

## Reto

### 1 — Contar sobre la lista filtrada

Muestra `visibles.length` en un párrafo. Escribe `Norte`. Quita el párrafo si no lo quieres dejar.

<details>
<summary>Ver solución</summary>

El número baja y el array de `datos.ts` no. Es un cálculo, no otro estado.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| La caja no se puede editar | Falta `onChange` o el `value` es un `let` | `value={texto}` y `setTexto` |
| El filtro no quita fichas | El `map` sigue en `entregables` | `visibles.map` |

## Laboratorio

La demostración filtró por texto. Aquí filtras por estado, con otro control, y el resultado sigue siendo un `const`.

### Objetivo

Una lista desplegable que deje solo `pendiente`, `revisado` o `rechazado`.

### Código de partida

`visibles` ya sale de `items` y `texto`. No lo metas en otro `useState`.

### Qué haces

1. Añade `const [modo, setModo] = useState("todos")`.
2. Encadena el filtro. El `map` sigue recorriendo `visibles`.
3. Elige `pendiente`. Cuentan E-101, E-103 y E-105.
4. Vuelve a `todos`.

```tsx
<label htmlFor="modo">Estado</label>
<select id="modo" value={modo} onChange={(evento) => setModo(evento.target.value)}>
  <option value="todos">todos</option>
  <option value="pendiente">pendiente</option>
  <option value="revisado">revisado</option>
  <option value="rechazado">rechazado</option>
</select>
```

```tsx
const porTexto = items.filter((item) => {
  const blob = `${item.titulo} ${item.proveedor} ${item.id}`.toLowerCase()
  return blob.includes(texto.toLowerCase())
})

const visibles = porTexto.filter((item) => modo === "todos" || item.estado === modo)
```

→ `pendiente` deja tres fichas. `Norte` dentro de ese modo deja solo las pendientes de Norte. No hay un `useState` para `visibles`.
