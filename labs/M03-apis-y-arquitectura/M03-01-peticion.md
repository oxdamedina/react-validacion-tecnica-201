# M03-01 — La petición

[← Página anterior](README.md) · [Siguiente página →](M03-02-estructura.md)

> Práctica de [La petición y los tres finales](01-peticion.md).

### Objetivo

Dejar de pintar el array importado y cargar `/entregables.json`, distinguiendo carga, error y filtro vacío.

### Código de partida

No hace falta el laboratorio de `useEffect` ni ningún hook de otra carpeta. Si tu `App.tsx` no tiene buscador, `marcar` y la pestaña «Pendientes: 3», sustituye `bandeja/src/App.tsx` por este archivo. `Tarjeta.tsx`, `datos.ts` y `modelo.ts` se quedan. `public/entregables.json` ya está en el repo.

```tsx
import { useEffect, useState } from "react"
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

  const pendientes = items.filter((item) => item.estado === "pendiente").length

  useEffect(() => {
    document.title = `Pendientes: ${pendientes}`
  }, [pendientes])

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

Con ese archivo, las seis fichas salen de `datos.ts`. Abre `http://localhost:5173/entregables.json`: el mismo array está publicado y la app todavía no lo pide.

### En qué consiste

Un guarda sobre `unknown` y un efecto que pide el JSON una vez. El experimento rompe el JSON, la URL y el filtro, y cada rotura se ve distinta.

### 1 — El guarda

**Dónde:** archivo nuevo `bandeja/src/api/entregables.ts`. `App.tsx` no se toca en este paso.

**Qué haces:**

1. Crea la carpeta `src/api` y el archivo con este contenido.
2. Guarda.
3. Busca `any` en el archivo. No debe estar.

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

**Experimento:** cambia `const datos: unknown` por `const datos: any`. Mira Problems. Vuelve a `unknown`.

→ Con `any`, el `every` deja de exigir el guarda. El archivo se queda en `unknown`.

**Validación:**

- Problems vacío.
- La página sigue saliendo de `datos.ts`: nadie llama todavía a `cargarEntregables`.

### 2 — Pedir una vez, y tres frases distintas

**Dónde:** `App.tsx`. Los hooks van antes de cualquier `return`.

**Qué haces:**

1. Quita el import de `entregables`. Importa `cargarEntregables`.
2. El estado inicial de `items` pasa a `[]`. Añade `cargando` y `error`.
3. Añade el efecto de la petición con `[]`, debajo del efecto del título.
4. Antes del `return` de la lista, las dos salidas de carga y error.
5. Guarda. Abre Network y recarga.

```tsx
import { cargarEntregables } from "./api/entregables"
```

```tsx
const [items, setItems] = useState<Entregable[]>([])
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

Esos dos `return` van después de los hooks. Un `useState` debajo de ellos rompe el orden.

**Experimento:**

1. En Network, al recargar hay una petición a `entregables.json` y luego las seis fichas. Escribe en «Buscar»: no sale otra petición.
2. En el JSON, E-104 pasa a `"estado": "listo"`. Recarga. La consola muestra el error y la página dice «No se pudo cargar la bandeja.» Restaura `"rechazado"`.
3. En `cargarEntregables`, la URL pasa a `"/no-esta.json"`. Recarga: el mismo aviso, ninguna ficha. Restaura `"/entregables.json"`.
4. Con la URL buena, escribe `zzzz`. Se lee «Ningún entregable coincide.» No hay `role="alert"`.

→ Cargar, fallar y no encontrar son tres frases. El filtro vacío no es un fallo de red.

**Validación:**

- Al recargar con el JSON sano, seis fichas y la pestaña «Pendientes: 3».
- Teclear no repite `entregables.json`.
- `datos.ts` puede seguir en el proyecto. `App` ya no lo importa.
- Problems vacío. No hay `any`.

## Comprueba tu entendimiento

**Dónde está la petición**
Busca `fetch` en `Tarjeta.tsx` y en el cuerpo de `App`, fuera de un efecto.
→ No está. Solo está dentro de `cargarEntregables`, y `App` la llama desde el efecto con `[]`.

## Reto

### 1 — Contar pendientes sobre la lista filtrada

Cambia un momento `pendientes` para que filtre `visibles` en vez de `items`. Escribe `Sur`. Restaura `items`.

<details>
<summary>Ver solución</summary>

Con `visibles`, `Sur` deja dos fichas ya revisadas y la pestaña baja a 0. El título mentía: filtrar no revisa. `pendientes` vuelve a salir de `items`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Sigue saliendo de `datos.ts` | El import de `entregables` sigue | El estado inicial es `[]` y el efecto llama a `cargarEntregables` |
| Una petición por cada letra | El `fetch` está en el cuerpo o el efecto no tiene `[]` | El efecto de la petición lleva `[]` |
| Pantalla en blanco al fallar | No hay rama de `error` | El `return` con `role="alert"` está antes del de la lista |
| `Rendered more hooks` | Un `useState` quedó debajo del `if (cargando)` | Todos los hooks, antes de esos `return` |
