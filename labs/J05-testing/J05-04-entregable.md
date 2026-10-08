# J05-04 — Validar un entregable

[← Página anterior](J05-07-componente.md) · [Siguiente página →](J05-05-checklist.md)

Validar es recorrer la pantalla como quien recibe el código. El caso automático cubre un flujo. El resto se mira: la pastilla, el foco de la etiqueta, el vacío y, si la lista viene por HTTP, la red.

## Demostración

### Objetivo

Recorrer la bandeja como quien la recibe y anotar una frase que no coincide.

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

`npm run dev` otra vez en el 5173. El caso de Cypress puede quedarse. Esta página es el navegador.

### 1 — Cuatro gestos

**Dónde:** la bandeja.

**Qué haces:**

1. Escribe `zzzz`. Anota la frase.
2. Borra. Pulsa la etiqueta «Buscar». Mira dónde está el foco.
3. Pulsa «Anotar» en E-101. Anota la pastilla y el botón.
4. Recarga. Anota si E-101 sigue revisado.

**Experimento:** si la pastilla no dice `revisado` tras el clic, no arregles todavía. Escribe la frase que viste. El laboratorio de riesgos vuelve a este fallo si lo dejas a propósito. Si la pastilla sí cambia, el entregable cumple ese gesto.

→ `zzzz` muestra «Ningún entregable coincide.». El foco cae en `#filtro` porque el `label` tiene `htmlFor="filtro"`. Tras recargar, E-101 vuelve a pendiente.

**Validación:**

- Has hecho los cuatro gestos.
- La URL no ha cambiado al marcar.
- `dev` sigue en marcha para el checklist.

## Comprueba tu entendimiento

**Qué no es validar**
Abrir `useState` y decir que el valor es el correcto no sustituye a la pastilla.
→ Quien recibe el código mira la pantalla. El caso de Cypress hace lo mismo.

## Reto

### 1 — La etiqueta suelta

Quita `htmlFor="filtro"` del `label`. Pulsa «Buscar». Restaura el atributo.

<details>
<summary>Ver solución</summary>

El foco no entra en la caja. `htmlFor` coincide con `id="filtro"`. Al restaurarlo, pulsar la etiqueta enfoca el input.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| No hay fichas | `dev` está parado o el `fetch` apunta a una URL mala | `npm run dev` y la URL `/entregables.json` si ya la usas |
| El foco no entra | `htmlFor` no coincide con el `id` | Los dos dicen `filtro` |

## Laboratorio

La demostración recorrió la bandeja con el ratón: vacío, foco, marca y recarga. Aquí el recorrido es solo con teclado.

### Objetivo

Llegar a la caja con Tab, escribir `Norte` y leer las fichas, sin pulsar el botón.

### Código de partida

`npm run dev` en el 5173. La caja tiene `<label htmlFor="filtro">`.

### Qué haces

1. Recarga. No uses el ratón.
2. Pulsa Tab hasta que el foco esté en la caja. Si el foco no llega, pulsa la etiqueta «Buscar» una sola vez y anótalo como fallo del recorrido.
3. Escribe `Norte`.
4. Comprueba que no está «Pruebas de carga» y sí «Informe de accesibilidad».

→ `Norte` deja las fichas de ese proveedor. No has marcado ninguna. La pastilla de E-101 sigue en `pendiente`.
