# J03-08 — Loading, error y vacío

[← Página anterior](J03-07-fetch.md) · [Siguiente página →](J03-09-estructura.md)

Cargar, fallar y no encontrar coincidencias son tres finales distintos. «Cargando entregables…» no es el aviso de error. «Ningún entregable coincide.» tampoco. El aviso de error lleva `role="alert"`. Los hooks van antes de esos `return`.

## Demostración

### Objetivo

Pintar una frase de espera, un aviso de error y el vacío del filtro, cada uno por su lado.

### Código de partida

Al recargar se ven las seis fichas. Hay una petición a `entregables.json`. Todavía no hay frase de carga ni aviso de error. Pega estos dos archivos si no es así.

`bandeja/src/api/entregables.ts`

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

`bandeja/src/App.tsx`

```tsx
import { useEffect, useState } from "react"
import type { Entregable } from "./modelo"
import Tarjeta from "./componentes/Tarjeta"
import { cargarEntregables } from "./api/entregables"

export default function App() {
  const [texto, setTexto] = useState("")
  const [items, setItems] = useState<Entregable[]>([])

  const visibles = items.filter((item) => {
    const blob = `${item.titulo} ${item.proveedor} ${item.id}`.toLowerCase()
    return blob.includes(texto.toLowerCase())
  })

  const pendientes = items.filter((item) => item.estado === "pendiente").length

  useEffect(() => {
    document.title = `Pendientes: ${pendientes}`
  }, [pendientes])

  useEffect(() => {
    let vivo = true
    cargarEntregables()
      .then((lista) => {
        if (vivo) setItems(lista)
      })
      .catch((causa: unknown) => {
        console.error(causa)
      })
    return () => {
      vivo = false
    }
  }, [])

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

### En qué consiste

Dos estados y dos salidas. El experimento cambia la URL, la restaura y comprueba que `zzzz` no es un error.

### 1 — Las tres frases

**Dónde:** `App.tsx`. Los `useState` y los `useEffect` van antes de cualquier `return`.

**Qué haces:**

1. Añade `cargando` en `true` y `error` en `""`.
2. En el efecto de la petición, enciende la carga al empezar, guarda el mensaje en el `catch` y apaga la carga en un `finally`.
3. Antes del `return` de la lista, pinta las dos ramas.
4. Guarda y recarga.

```tsx
const [cargando, setCargando] = useState(true)
const [error, setError] = useState("")
```

```tsx
useEffect(() => {
  let vivo = true
  setCargando(true)
  setError("")
  cargarEntregables()
    .then((lista) => {
      if (vivo) setItems(lista)
    })
    .catch((causa: unknown) => {
      console.error(causa)
      if (vivo) setError("No se pudo cargar la bandeja.")
    })
    .finally(() => {
      if (vivo) setCargando(false)
    })
  return () => {
    vivo = false
  }
}, [])
```

```tsx
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
```

**Experimento:**

1. En `cargarEntregables`, la URL pasa a `"/no-esta.json"`. Recarga.
2. Restaura `"/entregables.json"` y recarga.
3. Escribe `zzzz` en «Buscar».

→ Con la URL mala, «No se pudo cargar la bandeja.» y ninguna ficha. Con la URL buena, las seis. Con `zzzz`, «Ningún entregable coincide.» y el aviso de error no está.

**Validación:**

- Problems vacío.
- Los hooks están encima de los dos `return`.
- El párrafo del filtro no tiene `role="alert"`. El del error, sí.

## Comprueba tu entendimiento

**Vacío no es error**
Con la URL buena, deja la caja en `zzzz` e inspecciona el párrafo.
→ El texto es «Ningún entregable coincide.». No hay `role="alert"`.

## Reto

### 1 — Un hook debajo de la carga

Justo debajo de `if (cargando) return …`, declara `useState(0)` y úsalo en el return de la lista. Recarga.

<details>
<summary>Ver solución</summary>

La consola habla de hooks: en la primera pintura `cargando` es `true` y ese `useState` no se llama; cuando pasa a `false`, sí. Borra ese `useState`. Los hooks siguen antes de los `return`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Pantalla en blanco al fallar | No está el `return` de `error` | El aviso va antes del return de la lista |
| `zzzz` muestra el aviso de red | El vacío usa la misma frase que el `catch` | El filtro pinta «Ningún entregable coincide.» |
| `Rendered more hooks` | Hay un hook debajo de `if (cargando)` | Súbelo, o bórralo si era el experimento |

## Laboratorio

La demostración separó carga, error de red y vacío del filtro. Aquí el 403 es una frase distinta del error genérico.

### Objetivo

Si la respuesta es 403, el aviso dice «No tienes permiso para ver la bandeja.» Si es otro fallo, se queda la frase de siempre.

### Código de partida

`App` ya tiene `cargando`, `error` y los dos `return`. `cargarEntregables` lanza si `respuesta.ok` es falso.

### Qué haces

1. Haz que `cargarEntregables` lance un error con el status, o lee `respuesta.status` antes de lanzar y despacha el mensaje en `App`.
2. La forma corta: en el `catch`, si el mensaje contiene `403`, guardas la frase de permiso.
3. Fuerza el 403 sin servidor: en `cargarEntregables`, si la URL es la buena, lanza `new Error("Respuesta 403")` un momento.
4. Recarga. Lees la frase de permiso, no «No se pudo cargar la bandeja.».
5. Quita ese `throw`. Vuelve el JSON.

```tsx
if (!respuesta.ok) throw new Error(`Respuesta ${respuesta.status}`)
```

```tsx
.catch((causa: unknown) => {
  console.error(causa)
  const mensaje = causa instanceof Error ? causa.message : ""
  if (vivo) {
    setError(
      mensaje.includes("403")
        ? "No tienes permiso para ver la bandeja."
        : "No se pudo cargar la bandeja.",
    )
  }
})
```

→ Con el 403 forzado, la frase es la de permiso y no hay fichas. `zzzz` en la caja, con la URL buena, sigue siendo el vacío del filtro, sin `role="alert"`.
