# J03-03 — Memo y useMemo

[← Página anterior](J03-02-hoc.md) · [Siguiente página →](J03-04-reducer.md)

`memo` se salta la ficha si sus props son la misma referencia. Hace falta que `marcar` sea un `useCallback`: si la función es nueva, `memo` no se salta nada. Si el proveedor se pinta con otro objeto `{ revisor, setRevisor }`, quien lee el contexto se ejecuta aunque el nombre no haya cambiado. `useMemo` con `[revisor]` deja esa referencia quieta.

## Demostración

### Objetivo

Ver cuándo `memo` se salta `Tarjeta`, y cuándo un valor nuevo del contexto lo impide.

### Código de partida

El export de la ficha es `conRevisor(Tarjeta)`. `marcar` en `App` todavía es una `function`, no un `useCallback`. El proveedor entrega `{ revisor, setRevisor }` escrito en el JSX, sin `useMemo`. Pega estos archivos si no es así. La caja del revisor y el filtro siguen en `App` como en la página del HOC: `App` es el de esa partida, con `function marcar`.

`bandeja/src/hoc/conRevisor.tsx`

```tsx
import type { ComponentType } from "react"
import { useSesion } from "../contexto/Sesion"

export function conRevisor<P extends { revisor: string }>(
  Componente: ComponentType<P>,
) {
  function Envuelto(props: Omit<P, "revisor">) {
    const { revisor } = useSesion()
    const completas = { ...props, revisor } as P
    return <Componente {...completas} />
  }
  return Envuelto
}
```

`bandeja/src/componentes/Tarjeta.tsx`

```tsx
import type { Entregable } from "../modelo"
import { conRevisor } from "../hoc/conRevisor"

interface TarjetaProps {
  item: Entregable
  textoBoton?: string
  alMarcar: (id: string) => void
  revisor: string
}

function Tarjeta({
  item,
  textoBoton = "Anotar",
  alMarcar,
  revisor,
}: TarjetaProps) {
  return (
    <article>
      <p>{item.titulo}</p>
      <p>
        {item.id} · {item.proveedor}
      </p>
      <p>Revisor: {revisor}</p>
      <p className={`estado ${item.estado}`}>{item.estado}</p>
      {item.estado === "pendiente" ? <p>Falta revisión</p> : null}
      <button type="button" onClick={() => alMarcar(item.id)}>
        {item.estado === "revisado" ? "Hecho" : textoBoton} {item.id}
      </button>
    </article>
  )
}

export default conRevisor(Tarjeta)
```

`bandeja/src/contexto/Sesion.tsx`

```tsx
import { createContext, useContext, useState, type ReactNode } from "react"

interface Sesion {
  revisor: string
  setRevisor: (nombre: string) => void
}

const SesionContexto = createContext<Sesion | null>(null)

export function SesionProveedor({ children }: { children: ReactNode }) {
  const [revisor, setRevisor] = useState("Ana")
  return (
    <SesionContexto.Provider value={{ revisor, setRevisor }}>
      {children}
    </SesionContexto.Provider>
  )
}

export function useSesion(): Sesion {
  const sesion = useContext(SesionContexto)
  if (!sesion) throw new Error("useSesion fuera del proveedor")
  return sesion
}
```

`bandeja/src/App.tsx`

```tsx
import { useState } from "react"
import { entregables } from "./datos"
import type { Entregable } from "./modelo"
import Tarjeta from "./componentes/Tarjeta"
import { useSesion } from "./contexto/Sesion"

export default function App() {
  const [texto, setTexto] = useState("")
  const [items, setItems] = useState<Entregable[]>(entregables)
  const { revisor, setRevisor } = useSesion()

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
      <label htmlFor="revisor">Revisor</label>
      <input
        id="revisor"
        value={revisor}
        onChange={(evento) => setRevisor(evento.target.value)}
      />
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

### 1 — La ficha se ejecuta al teclear

**Dónde:** `Tarjeta.tsx`, primera línea de la función.

**Qué haces:**

1. Añade el `console.log`.
2. Guarda. Limpia la consola.
3. Escribe una letra en «Buscar».

```tsx
console.log(item.id)
```

→ Aparecen ids. `App` se ha vuelto a ejecutar y la ficha es hija suya. En desarrollo pueden salir repetidos: `StrictMode` en `main.tsx` llama dos veces. No es un fallo. Mira si salen líneas nuevas.

### 2 — memo y una función estable

**Dónde:** `App.tsx` y la última línea de `Tarjeta.tsx`.

**Qué haces:**

1. `marcar` pasa a `useCallback`.
2. Envuelve el HOC con `memo`.
3. Limpia la consola y escribe otra letra.

```tsx
import { useCallback, useState } from "react"
```

```tsx
const marcar = useCallback((id: string) => {
  setItems((lista) =>
    lista.map((item) =>
      item.id === id ? { ...item, estado: "revisado" } : item,
    ),
  )
}, [])
```

```tsx
import { memo } from "react"
```

```tsx
export default memo(conRevisor(Tarjeta))
```

→ No salen ids nuevos. `memo` compara `item` y `alMarcar`. La función es la misma porque `useCallback` tiene `[]`. El proveedor, en `main.tsx`, no se entera de la caja «Buscar».

### 3 — El valor del contexto, nuevo en cada pintado

**Dónde:** `bandeja/src/contexto/Sesion.tsx`.

**Qué haces:**

1. Añade un estado que no es el revisor, y un botón. El `value` es un objeto escrito en el JSX.
2. Limpia la consola y pulsa «Tocar».
3. Memoriza el valor con `[revisor]`.
4. Limpia la consola, pulsa «Tocar» otra vez y después escribe `Luis`.
5. Quita `tocar`, el botón y el `console.log`. Deja el `useMemo` y el `memo`.

Primero, sin memorizar:

```tsx
const [revisor, setRevisor] = useState("Ana")
const [tocar, setTocar] = useState(0)
return (
  <SesionContexto.Provider value={{ revisor, setRevisor }}>
    <button type="button" onClick={() => setTocar(tocar + 1)}>
      Tocar {tocar}
    </button>
    {children}
  </SesionContexto.Provider>
)
```

→ «Tocar» pasa de 0 a 1 y el nombre sigue en Ana, pero la consola escribe los ids. `memo` no frena esto: el proveedor se pintó con otro objeto, y `conRevisor` lee ese contexto.

Ahora el valor memorizado. El botón se queda un momento:

```tsx
import { useMemo, useState, type ReactNode } from "react"
```

```tsx
const valor = useMemo(() => ({ revisor, setRevisor }), [revisor])

return (
  <SesionContexto.Provider value={valor}>
    <button type="button" onClick={() => setTocar(tocar + 1)}>
      Tocar {tocar}
    </button>
    {children}
  </SesionContexto.Provider>
)
```

→ «Tocar» ya no escribe ids. `Luis` sí: el nombre cambió, el valor es otro y las seis fichas dicen «Revisor: Luis».

Al terminar, `SesionProveedor` se queda así. Sin botón y sin `tocar`.

```tsx
export function SesionProveedor({ children }: { children: ReactNode }) {
  const [revisor, setRevisor] = useState("Ana")
  const valor = useMemo(() => ({ revisor, setRevisor }), [revisor])
  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>
}
```

**Validación:**

- `export default memo(conRevisor(Tarjeta))`.
- `marcar` es un `useCallback` con `[]`.
- No quedan `console.log` ni el botón «Tocar».
- Problems vacío.

## Comprueba tu entendimiento

**Qué compara memo**
`memo` mira las props. El contexto lo mira quien llama a `useSesion`, aquí `Envuelto`.
→ Si el `value` es otro objeto, `Envuelto` se ejecuta aunque `item` sea el mismo. Por eso el `useMemo` está en el proveedor.

## Reto

### 1 — Quitar el useCallback

Deja `marcar` otra vez como `function`, con `memo` puesto. Escribe una letra.
→ Vuelven los ids: `alMarcar` es una función nueva y `memo` lo toma por un cambio. Restaura el `useCallback`.

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Teclear sigue escribiendo ids | `marcar` no está en `useCallback`, o el `memo` no envuelve el export | `useCallback` con `[]` y `memo(conRevisor(Tarjeta))` |
| «Tocar» no escribe ids y aún no hay `useMemo` | El `value` ya era una constante | Vuelve a `value={{ revisor, setRevisor }}` para el experimento |
| El revisor no cambia | El `useMemo` tiene `[]` | La dependencia es `[revisor]` |

## Laboratorio

La demostración memorizó el valor del contexto y la ficha. Aquí `useMemo` guarda un texto calculado, el resumen de la caja.

### Objetivo

Pintar «3 fichas para Norte» sin recalcular mal cuando cambias el filtro.

### Código de partida

`App` tiene `visibles` y `texto`. No hace falta el contexto ni `memo` para este ejercicio.

### Qué haces

1. Importa `useMemo`.
2. Pega `resumen` y el párrafo bajo la caja.
3. Escribe `Norte`. El párrafo baja a las fichas de ese proveedor.
4. Quita `texto` de las dependencias. Escribe `Sur`. El párrafo miente. Restaura `[visibles, texto]`.

```tsx
import { useMemo, useState } from "react"
```

```tsx
const resumen = useMemo(
  () => `${visibles.length} fichas para ${texto || "todo"}`,
  [visibles, texto],
)
```

```tsx
<p>{resumen}</p>
```

→ Con `Norte` se lee «2 fichas para Norte» (Informe y Manual). Sin `texto` en el array, la caja dice Sur y el párrafo sigue hablando de Norte. Se restituye la dependencia.
