# J01-07 — Eventos

[← Página anterior](J01-06-props.md) · [Siguiente página →](../J02-estado/README.md)

`onClick` recibe una función. `onClick={alMarcar(item.id)}` la ejecutaría al pintar. La que espera al clic es `() => alMarcar(item.id)`. `type="button"` deja la intención explícita. El clic avisa al padre. El padre cambia la pastilla.

## Demostración

### Objetivo

Ver que el clic espera a la flecha, y que el manejador es una prop que sube al padre.

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

### 1 — La flecha

**Dónde:** `Tarjeta.tsx`, el botón. La consola del navegador, abierta.

**Qué haces:**

1. Recarga. No pulses. Confirma que la consola no se llena de ids por pintar.
2. Cambia el `onClick` a `onClick={alMarcar(item.id)}`. Guarda y lee Problems o la consola.
3. Restaura `onClick={() => alMarcar(item.id)}`.
4. Pulsa «Anotar E-101». Mira la pastilla y E-103. Recarga.

**Experimento:** quita `type="button"` y vuelve a ponerlo. Aquí no hay formulario; el atributo deja la intención escrita.

→ Sin la flecha, la llamada no espera al clic. Con la flecha, E-101 pasa a `revisado` y el botón dice «Hecho E-101». E-103 sigue pendiente. Al recargar, E-101 vuelve a pendiente.

**Validación:**

- El `onClick` tiene `() =>`.
- Problems vacío.
- La URL no cambia al pulsar.

## Comprueba tu entendimiento

**Quién cambia la pastilla**
`Tarjeta` no llama a `setItems`. Llama a `alMarcar`.
→ La función que copia el objeto está en el padre, o en el hook si ya lo tienes.

## Reto

### 1 — El tipo del evento

Pasa el evento y escribe su `type`, sin `any`.

<details>
<summary>Ver solución</summary>

```tsx
onClick={(evento: React.MouseEvent<HTMLButtonElement>) => {
  console.log(evento.type)
  alMarcar(item.id)
}}
```

Al pulsar, la consola escribe `click` y la pastilla cambia. Puedes dejar solo `() => alMarcar(item.id)`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| La pastilla cambia al cargar | El `onClick` llama a la función al pintar | `() => alMarcar(item.id)` |
| Un clic no hace nada | Falta `alMarcar` en la etiqueta | `alMarcar={marcar}` en el `map` |
| Cambia otra ficha | La función cierra sobre un id fijo | El argumento es `item.id` de esa ficha |

## Laboratorio

La demostración arregló el `onClick` del botón de anotar. Aquí el evento es otro: el ratón entra en la ficha.

### Objetivo

Cambiar el borde de la ficha al pasar el ratón, sin usar el botón.

### Código de partida

El botón sigue con `onClick={() => alMarcar(item.id)}` y `type="button"`.

### Qué haces

1. En `Tarjeta`, añade un estado local solo para este ejercicio.
2. El `<article>` escucha `onMouseEnter` y `onMouseLeave`.
3. Pasa el ratón por una ficha y por el fondo de la página.
4. Borra el estado y los dos eventos. El botón de anotar se queda.

```tsx
import { useState } from "react"
```

```tsx
const [encima, setEncima] = useState(false)
```

```tsx
<article
  onMouseEnter={() => setEncima(true)}
  onMouseLeave={() => setEncima(false)}
  style={encima ? { outline: "2px solid #333" } : undefined}
>
```

→ El borde aparece al entrar y se va al salir. Pulsar «Anotar» sigue marcando. `onMouseEnter={setEncima(true)}` sin flecha marcaría el borde al pintar: no lo dejes así.
