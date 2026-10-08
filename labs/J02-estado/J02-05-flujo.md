# J02-05 — Flujo de datos

[← Página anterior](J02-04-ciclo.md) · [Siguiente página →](J02-06-separacion.md)

El estado baja. El aviso sube. `Tarjeta` no llama a `setItems`. Recibe `alMarcar` y la llama con el id. El padre copia el objeto de ese id. La pastilla lee `item.estado`. El botón dice «Hecho» cuando ese campo es `revisado`.

## Demostración

### Objetivo

Dejar el estado en el padre y el aviso en la ficha, y comprobar que solo cambia el id pulsado.

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

### 1 — Baja el dato, sube el id

**Dónde:** `marcar` en `App.tsx` y el botón en `Tarjeta.tsx`.

**Qué haces:**

1. Pulsa «Anotar E-101». Mira pastilla, «Falta revisión» y el botón. Mira E-103.
2. Recarga.
3. Quita `item.id === id` para que todos pasen a `revisado`. Pulsa una ficha.
4. Restaura la comparación.

**Experimento:** escribe `Norte`, marca E-101 y no borres la caja.

→ E-101 queda `revisado` y sigue visible. E-103, si está, sigue pendiente. Sin la comparación, un clic marca todas las que se ven. Al recargar, E-101 vuelve a pendiente.

**Validación:**

- El botón dice «Hecho» solo si `item.estado === "revisado"`.
- `Tarjeta` no importa `useState`.
- Problems vacío.

## Comprueba tu entendimiento

**La verdad del entregable**
Deja la pastilla leyendo `item.estado` y el botón siempre en «Anotar». Marca.
→ La pastilla cambia y el botón miente. Restaura el ternario del botón.

## Reto

### 1 — Avisar con el estado, no con el id

Cambia la prop a `(estado: string) => void` y pasa `item.estado`. Mira qué ficha cambia. Vuelve al id.

<details>
<summary>Ver solución</summary>

Varias fichas comparten `pendiente`. El padre no distingue cuál fue. El aviso vuelve a ser el id.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| No cambia ninguna | `alMarcar` no está en la etiqueta | `alMarcar={marcar}` |
| Cambian todas | El `map` no compara el id | `item.id === id` |

## Laboratorio

La demostración subió el id para marcar como revisado. Aquí sube el id para otro destino.

### Objetivo

Un segundo botón, «Rechazar», que avisa al padre y el padre pone `rechazado`.

### Código de partida

`Tarjeta` llama a `alMarcar(item.id)`. `marcar` en `App` copia el objeto con `estado: "revisado"`.

### Qué haces

1. Añade `alRechazar: (id: string) => void` a las props y un botón.
2. En `App`, `rechazar` es otro `setItems`. Pásalo en el `map`.
3. Pulsa «Rechazar» en E-103. La pastilla dice `rechazado`. E-101 sigue pendiente.
4. Puedes dejar el botón.

```tsx
alRechazar: (id: string) => void
```

```tsx
<button type="button" onClick={() => alRechazar(item.id)}>
  Rechazar {item.id}
</button>
```

```tsx
function rechazar(id: string): void {
  setItems((lista) =>
    lista.map((item) =>
      item.id === id ? { ...item, estado: "rechazado" } : item,
    ),
  )
}
```

`Tarjeta` no llama a `setItems`. Solo avisa.

→ E-103 queda `rechazado`. «Anotar E-101» sigue pasando esa ficha a `revisado`. Son dos avisos distintos.
