# J03-11 — Componente reutilizable

[← Página anterior](J03-10-responsabilidades.md) · [Siguiente página →](J03-12-antipatrones.md)

`Tarjeta` es una función. Seis fichas salen de un `map`, no de seis copias. `textoBoton` cambia el rótulo sin tocar el componente. `item` es obligatorio: sin esa prop no compila.

## Demostración

### Objetivo

Ver que seis fichas salen de un solo `Tarjeta`, y que una prop opcional cambia el rótulo sin copiar el archivo.

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

Hay un solo archivo `Tarjeta.tsx`. El `map` lo usa seis veces.

### En qué consiste

Una prop más en una sola etiqueta. El experimento la quita y quita también `item`.

### 1 — Un archivo, seis fichas

**Dónde:** `App.tsx`, en el `map`. `Tarjeta.tsx` no se copia.

**Qué haces:**

1. En la primera vuelta del `map`, pasa `textoBoton` solo si el id es `E-104`.
2. Guarda.
3. Lee los botones.
4. Quita el atributo.

```tsx
<Tarjeta
  item={item}
  alMarcar={marcar}
  textoBoton={item.id === "E-104" ? "Registrar" : undefined}
/>
```

**Experimento:** quita `item={item}` y guarda. Lee Problems. Vuelve a poner `item={item}` y quita `textoBoton`.

→ Con el atributo, E-104 dice «Registrar E-104» si sigue rechazado. El resto dice «Anotar» o «Hecho». Sin `item`, Problems marca la etiqueta. Sin `textoBoton`, E-104 vuelve a «Anotar». Sigue habiendo un solo archivo `Tarjeta.tsx`.

**Validación:**

- No hay seis funciones `Tarjeta` copiadas.
- `item` no es opcional en la interfaz.
- Problems vacío al terminar.

## Comprueba tu entendimiento

**El defecto no es un any**
Pasa `textoBoton={1}`.
→ Problems pide `string`. Quita ese valor.

## Reto

### 1 — El borde en el componente, no en el li

La clase visual de la ficha ya está en `article` dentro de `Tarjeta`. Quita un momento el `<li>` y pon `key` en `Tarjeta`. Lee la consola. Devuelve el `<li key={item.id}>`.

<details>
<summary>Ver solución</summary>

`key` en el componente no identifica al hijo del `map`. El aviso de la consola, o la posición inestable al filtrar, es la señal. `key={item.id}` vuelve al `<li>`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Todas dicen «Registrar» | `textoBoton` está fijo en `Tarjeta` | El defecto es `"Anotar"` y el atributo solo va en E-104 |
| `item` posiblemente indefinido | La prop quedó con `?` | `item: Entregable`, sin `?` |

## Laboratorio

La demostración cambió `textoBoton` en una ficha. Aquí la prop cambia el hueco, no la palabra del botón.

### Objetivo

`ancho` elige si la ficha se estira o se queda estrecha. El defecto es estrecha.

### Código de partida

Un solo `Tarjeta.tsx`. El `map` lo usa seis veces. `item` sigue siendo obligatorio.

### Qué haces

1. Añade `ancho?: "estrecho" | "ancho"` con defecto `"estrecho"`.
2. El `<article>` usa `style` según ese valor.
3. En el `map`, E-106 va `ancho`. El resto no pasa la prop.
4. Quita el atributo. E-106 vuelve al defecto.

```tsx
ancho?: "estrecho" | "ancho"
```

```tsx
function Tarjeta({ item, textoBoton = "Anotar", alMarcar, ancho = "estrecho" }: TarjetaProps) {
```

```tsx
<article style={{ maxWidth: ancho === "ancho" ? 480 : 240 }}>
```

```tsx
<Tarjeta item={item} alMarcar={marcar} ancho={item.id === "E-106" ? "ancho" : undefined} />
```

→ E-106 es más ancha. Las otras caben en 240. Sin la prop, las seis usan el defecto. Sigue habiendo un solo archivo de ficha.
