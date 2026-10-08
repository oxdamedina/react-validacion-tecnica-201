# J03-06 — Ciclo: reducer, store y API

[← Página anterior](J03-05-store.md) · [Siguiente página →](J03-07-fetch.md)

La pantalla lee el estado y manda acciones. El reductor devuelve el estado siguiente y no llama a la red. La función que pide el JSON vive al lado: despacha un objeto al empezar y otro objeto cuando la promesa termina. `dispatch` no recibe una función. Eso no es Redux y no es un thunk.

El círculo, con la bandeja:

1. Al montar, `cargar` llama a `pedir`.
2. `pedir` hace `dispatch({ type: "cargar" })`.
3. El reductor pone `cargando: true`. Se lee «Cargando entregables…».
4. `pedir` espera `/entregables.json`. Esa espera no está en el reductor.
5. `pedir` hace `dispatch({ type: "listo", items })` o `dispatch({ type: "fallo", mensaje })`.
6. El reductor guarda la lista o el aviso. La pantalla lo pinta.
7. Un clic hace `dispatch({ type: "marcar", id })`. El reductor copia esa ficha. La pastilla cambia.

## Demostración

### Objetivo

Cerrar ese círculo con `useReducer` y `useStore`, y con una petición que solo despacha objetos.

### Código de partida

Pega estos dos archivos y recarga `http://localhost:5173`. Hay seis fichas que salen de `datos.ts`. No hay petición en la pestaña Red. `public/entregables.json` ya está: ábrelo en `http://localhost:5173/entregables.json` y verás los mismos seis.

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

### 1 — El reductor, sin pantalla

**Dónde:** archivo nuevo `bandeja/src/tienda.tsx`. Nadie lo importa todavía.

**Qué haces:** pega el archivo. Guarda. La bandeja no cambia: siguen las seis fichas de `datos.ts`.

```tsx
import type { Entregable } from "./modelo"

export interface EstadoBandeja {
  items: Entregable[]
  cargando: boolean
  error: string
}

export const inicial: EstadoBandeja = {
  items: [],
  cargando: false,
  error: "",
}

export type Accion =
  | { type: "cargar" }
  | { type: "listo"; items: Entregable[] }
  | { type: "fallo"; mensaje: string }
  | { type: "marcar"; id: string }

export function reducir(estado: EstadoBandeja, accion: Accion): EstadoBandeja {
  switch (accion.type) {
    case "cargar":
      return { ...estado, cargando: true, error: "" }
    case "listo":
      return { items: accion.items, cargando: false, error: "" }
    case "fallo":
      return { items: [], cargando: false, error: accion.mensaje }
    case "marcar":
      return {
        ...estado,
        items: estado.items.map((item) =>
          item.id === accion.id ? { ...item, estado: "revisado" } : item,
        ),
      }
  }
}
```

→ Cada `case` devuelve un estado. No hay `fetch` ni `dispatch`. `"cargar"` solo enciende el flag. `"listo"` guarda la lista que venga en la acción. `"marcar"` copia un objeto.

### 2 — Un clic, una acción, seis fichas

**Dónde:** `App.tsx`. Quita `useState` de `items` y `setItems`.

**Qué haces:**

1. Sustituye la cabecera y el estado por esto.
2. Deja el filtro, el `return` y `Tarjeta` como estaban.
3. Recarga. La lista está vacía: el estado inicial no trae fichas.
4. Pulsa «Traer de memoria». Vuelven las seis. En la pestaña Red no hay `entregables.json`.

```tsx
import { useReducer, useState } from "react"
import { entregables } from "./datos"
import { inicial, reducir } from "./tienda"
import Tarjeta from "./componentes/Tarjeta"
```

```tsx
const [texto, setTexto] = useState("")
const [estado, dispatch] = useReducer(reducir, inicial)
const items = estado.items

function marcar(id: string): void {
  dispatch({ type: "marcar", id })
}
```

Dentro de `<main>`, encima de «Buscar»:

```tsx
<button type="button" onClick={() => dispatch({ type: "listo", items: entregables })}>
  Traer de memoria
</button>
```

→ El botón no llama a `setItems`. Manda `{ type: "listo", items: entregables }`. El reductor devuelve esas fichas y React vuelve a pintar. El círculo ya da una vuelta, todavía sin red.

### 3 — La red, en otra función

**Dónde:** archivo nuevo `bandeja/src/api/entregables.ts`, y al final de `tienda.tsx`.

**Qué haces:**

1. Pega la API.
2. Pega `pedir` debajo de `reducir`.
3. En `App`, quita el botón «Traer de memoria» y el import de `entregables`.
4. Añade el efecto. Recarga con la pestaña Red abierta.

```tsx
import type { Entregable, EstadoEntregable } from "../modelo"

function esEstado(valor: unknown): valor is EstadoEntregable {
  return valor === "pendiente" || valor === "revisado" || valor === "rechazado"
}

function esEntregable(valor: unknown): valor is Entregable {
  if (typeof valor !== "object" || valor === null) return false
  const candidato = valor as Record<string, unknown>
  return (
    typeof candidato.id === "string" &&
    typeof candidato.titulo === "string" &&
    typeof candidato.proveedor === "string" &&
    esEstado(candidato.estado)
  )
}

export async function cargarEntregables(): Promise<Entregable[]> {
  const respuesta = await fetch("/entregables.json")
  if (!respuesta.ok) throw new Error(`Respuesta ${respuesta.status}`)
  const datos: unknown = await respuesta.json()
  if (!Array.isArray(datos) || !datos.every(esEntregable)) {
    throw new Error("El JSON no es una lista de entregables")
  }
  return datos
}
```

```tsx
import { cargarEntregables } from "./api/entregables"
```

```tsx
export async function pedir(dispatch: (accion: Accion) => void): Promise<void> {
  dispatch({ type: "cargar" })
  try {
    const items = await cargarEntregables()
    dispatch({ type: "listo", items })
  } catch (causa: unknown) {
    console.error(causa)
    dispatch({ type: "fallo", mensaje: "No se pudo cargar la bandeja." })
  }
}
```

En `App.tsx`:

```tsx
import { useEffect, useReducer, useState } from "react"
import { inicial, pedir, reducir } from "./tienda"
```

```tsx
useEffect(() => {
  void pedir(dispatch)
}, [])
```

→ Al recargar hay una petición a `entregables.json` y después las seis fichas. `pedir` hace dos `dispatch`, los dos con un objeto. El primero es `"cargar"`. El segundo es `"listo"`. El reductor no ha visto la promesa.

**Experimento:** en `cargarEntregables`, la URL pasa a `"/no-esta.json"`. Recarga. La consola muestra el error y no hay fichas: la acción fue `"fallo"`. Restaura `"/entregables.json"`.

### 4 — Lo que se lee en cada tramo

**Dónde:** `App.tsx`, antes del `return` de la lista. Los hooks siguen arriba.

**Qué haces:** pega las dos salidas. Recarga. Cambia otra vez la URL a `"/no-esta.json"`, mira el aviso, y restaura `"/entregables.json"`.

```tsx
if (estado.cargando) {
  return (
    <main>
      <h1>Bandeja de entregables</h1>
      <p>Cargando entregables…</p>
    </main>
  )
}

if (estado.error) {
  return (
    <main>
      <h1>Bandeja de entregables</h1>
      <p role="alert">{estado.error}</p>
    </main>
  )
}
```

→ Con la URL mala se lee «No se pudo cargar la bandeja.» y ninguna ficha. Con la URL buena, una frase breve de carga y enseguida las seis. `zzzz` en «Buscar» sigue siendo «Ningún entregable coincide.», sin `role="alert"`.

Pulsa «Anotar E-101». Solo esa pastilla pasa a `revisado`. Esa vuelta no toca la red: `marcar` sigue siendo `dispatch({ type: "marcar", id })`.

### 5 — La tienda cierra el círculo

**Dónde:** `tienda.tsx`, `main.tsx`, `App.tsx`.

**Qué haces:** sustituye `tienda.tsx` por el archivo de abajo. Envuelve `<App />`. Deja `App` sin `useReducer` y sin `pedir`.

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react"
import { cargarEntregables } from "./api/entregables"
import type { Entregable } from "./modelo"

export interface EstadoBandeja {
  items: Entregable[]
  cargando: boolean
  error: string
}

const inicial: EstadoBandeja = {
  items: [],
  cargando: true,
  error: "",
}

type Accion =
  | { type: "cargar" }
  | { type: "listo"; items: Entregable[] }
  | { type: "fallo"; mensaje: string }
  | { type: "marcar"; id: string }

function reducir(estado: EstadoBandeja, accion: Accion): EstadoBandeja {
  switch (accion.type) {
    case "cargar":
      return { ...estado, cargando: true, error: "" }
    case "listo":
      return { items: accion.items, cargando: false, error: "" }
    case "fallo":
      return { items: [], cargando: false, error: accion.mensaje }
    case "marcar":
      return {
        ...estado,
        items: estado.items.map((item) =>
          item.id === accion.id ? { ...item, estado: "revisado" } : item,
        ),
      }
  }
}

async function pedir(dispatch: (accion: Accion) => void): Promise<void> {
  dispatch({ type: "cargar" })
  try {
    const items = await cargarEntregables()
    dispatch({ type: "listo", items })
  } catch (causa: unknown) {
    console.error(causa)
    dispatch({ type: "fallo", mensaje: "No se pudo cargar la bandeja." })
  }
}

interface Tienda {
  estado: EstadoBandeja
  marcar: (id: string) => void
}

const TiendaContexto = createContext<Tienda | null>(null)

export function TiendaProveedor({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducir, inicial)
  const marcar = useCallback((id: string) => {
    dispatch({ type: "marcar", id })
  }, [])
  const valor = useMemo(() => ({ estado, marcar }), [estado, marcar])

  useEffect(() => {
    void pedir(dispatch)
  }, [])

  return <TiendaContexto.Provider value={valor}>{children}</TiendaContexto.Provider>
}

export function useStore(): Tienda {
  const tienda = useContext(TiendaContexto)
  if (!tienda) throw new Error("useStore fuera de TiendaProveedor")
  return tienda
}
```

`main.tsx`:

```tsx
import { TiendaProveedor } from "./tienda"
```

```tsx
<TiendaProveedor>
  <App />
</TiendaProveedor>
```

`App.tsx` queda así. El filtro sigue aquí. La lista sale de `useStore()`.

```tsx
import { useState } from "react"
import Tarjeta from "./componentes/Tarjeta"
import { useStore } from "./tienda"

export default function App() {
  const [texto, setTexto] = useState("")
  const { estado, marcar } = useStore()
  const { items, cargando, error } = estado

  const visibles = items.filter((item) => {
    const blob = `${item.titulo} ${item.proveedor} ${item.id}`.toLowerCase()
    return blob.includes(texto.toLowerCase())
  })

  if (cargando) {
    return (
      <main>
        <h1>Bandeja de entregables</h1>
        <p>Cargando entregables…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1>Bandeja de entregables</h1>
        <p role="alert">{error}</p>
      </main>
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

→ Recarga: una petición y las seis fichas. «Anotar E-101» cambia solo esa pastilla. `App.tsx` no importa `useReducer`. `reducir` no importa `fetch`.

`useMemo` deja quieto el objeto `{ estado, marcar }` mientras `estado` no cambie. `marcar` es un `useCallback` con `[]`, así que no es una función nueva en cada pintado.

**Experimento:** quita `<TiendaProveedor>` y recarga. Lees «useStore fuera de TiendaProveedor». Vuelve a envolver `<App />`.

### 6 — Por qué no va el fetch dentro del reductor

**Dónde:** `reducir`, el `case "cargar"`.

**Qué haces:** escribe un momento `void fetch("/entregables.json")` dentro de ese `case`, antes del `return`. Recarga y mira la pestaña Red. Borra esa línea.

→ Sale la petición del `case` y otra de `pedir`. El reductor se ha ejecutado para calcular el estado, y además ha hablado con la red. Se queda solo el `return`. La única petición, al recargar, es la de `pedir`.

Un thunk sería `dispatch` de una función, y esa función llamaría a `dispatch` otra vez. Aquí no se hace. `pedir` es una función aparte. Cada `dispatch` lleva un objeto con `type`.

**Validación:**

- Problems vacío.
- `reducir` no contiene `fetch` ni `dispatch`.
- Al recargar, una petición a `entregables.json` y seis fichas.
- E-101 pasa a `revisado` y E-103 no.
- `useStore` está en `tienda.tsx`.

## Comprueba tu entendimiento

**Quién espera la promesa**
Busca `await` en `tienda.tsx`.
→ Está en `pedir`, no en `reducir`. El reductor ya ha devuelto `{ ...estado, cargando: true, error: "" }` antes de que llegue el JSON.

## Reto

### 1 — Una acción que no es un objeto

En `pedir`, cambia el primer `dispatch({ type: "cargar" })` por `dispatch(async () => {})` y mira Problems. Restaura el objeto.

<details>
<summary>Ver solución</summary>

`dispatch` espera un `Accion`: un objeto con `type`. Una función no entra en el `switch`. Se deja `dispatch({ type: "cargar" })`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| La lista sigue saliendo de `datos.ts` | `useState(entregables)` sigue en `App` | `items` sale de `estado.items` |
| Dos peticiones al recargar | El `fetch` de prueba sigue en el reductor, o `pedir` está en `App` y en la tienda | Solo el `pedir` del proveedor |
| `useStore fuera de TiendaProveedor` | `<App />` quedó fuera | El proveedor envuelve `<App />` en `main.tsx` |
| El reductor no cubre el `type` | Falta un `case` | `"cargar"`, `"listo"`, `"fallo"` y `"marcar"` devuelven estado |

## Laboratorio

La demostración cerró el círculo una vez, al montar. Aquí das otra vuelta a mano, con un botón que vuelve a pedir el JSON.

### Objetivo

«Actualizar» llama a `pedir` otra vez. El reductor sigue sin `fetch`. `dispatch` sigue recibiendo objetos.

### Código de partida

La tienda de la demostración: `pedir`, `useReducer`, `useStore`, y el efecto que pide al montar. Si no está, el paso 5 de esta página trae el archivo.

### Qué haces

1. `pedir` ya está. En el proveedor, crea `actualizar` con `useCallback` que llama a `void pedir(dispatch)`.
2. Añádelo a la interfaz, al `useMemo` y a lo que devuelve `useStore`.
3. En `App`, cuando ya hay fichas, un botón «Actualizar».
4. Abre la Red. Pulsa el botón. Sale otra petición a `entregables.json`. La lista se vuelve a pintar.
5. No metas `fetch` en el `case "cargar"`.

```tsx
const actualizar = useCallback(() => {
  void pedir(dispatch)
}, [])
```

```tsx
interface Tienda {
  estado: EstadoBandeja
  marcar: (id: string) => void
  actualizar: () => void
}
```

```tsx
const { estado, marcar, actualizar } = useStore()
```

```tsx
<button type="button" onClick={actualizar}>Actualizar</button>
```

→ Cada clic del botón es una petición. El reductor solo ve `"cargar"` y luego `"listo"`. No hay una función dentro de `dispatch`.
