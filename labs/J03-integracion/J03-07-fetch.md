# J03-07 — Consumo de API

[← Página anterior](J03-06-ciclo.md) · [Siguiente página →](J03-08-finales.md)

`fetch` devuelve una promesa. Hasta comprobarlo, el JSON es `unknown`. Un guarda mira campo a campo y solo entonces el valor es `Entregable[]`. La petición va en un efecto con `[]`, no en el cuerpo del componente.

## Demostración

### Objetivo

Cargar `/entregables.json` y aceptar la respuesta solo si cada elemento es un `Entregable`.

### Código de partida

La lista todavía sale de `datos.ts`. La pestaña dice «Bandeja de entregables» hasta que pegues el `App` de abajo, que ya calcula «Pendientes: 3» y aún no llama a `fetch`. `public/entregables.json` ya está. Ábrelo en `http://localhost:5173/entregables.json`: son los seis objetos, y la app no los pide.

`bandeja/src/App.tsx`

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

Un guarda sobre `unknown` y un efecto que pide el JSON una vez.

### 1 — El guarda

**Dónde:** archivo nuevo `bandeja/src/api/entregables.ts`.

**Qué haces:**

1. Crea la carpeta y el archivo.
2. Guarda.
3. Busca `any`. No debe estar.

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

**Experimento:** cambia `unknown` por `any` en `datos`. Mira Problems. Vuelve a `unknown`.

→ Con `any` el guarda deja de exigirse. El archivo se queda en `unknown`. La página no ha cambiado.

### 2 — Llamarla una vez

**Dónde:** `App.tsx`. Quita el import de `entregables`. Los hooks siguen antes del `return`.

**Qué haces:**

1. Importa `cargarEntregables`.
2. `items` empieza en `[]`.
3. Añade este efecto debajo del título de la pestaña.
4. Recarga con Network abierto.

```tsx
import { cargarEntregables } from "./api/entregables"
```

```tsx
const [items, setItems] = useState<Entregable[]>([])
```

```tsx
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
```

**Experimento:** en el JSON, pon `"estado": "listo"` en E-104. Recarga. Restaura `"rechazado"`.

→ Con `"listo"`, la consola muestra el error y no aparecen fichas a medias. Al restaurar, Network tiene una petición y luego las seis. Teclear en «Buscar» no añade otra.

**Validación:**

- Al recargar, seis fichas y la pestaña «Pendientes: 3».
- `App` ya no importa `datos.ts`.
- Problems vacío. No hay `any`.

## Comprueba tu entendimiento

**Dónde está fetch**
Busca `fetch` en `Tarjeta.tsx` y fuera de `cargarEntregables`.
→ No está. `App` solo llama a `cargarEntregables` desde el efecto con `[]`.

## Reto

### 1 — Una petición por letra

Mueve la llamada a `cargarEntregables()` al cuerpo de `App`, fuera del efecto. Escribe una letra. Devuélvela al efecto.

<details>
<summary>Ver solución</summary>

Network dispara una petición por cada letra. El cuerpo del componente corre en cada pintado. La llamada vuelve al efecto con `[]`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Sigue el array de `datos.ts` | El import y el `useState(entregables)` siguen | Estado inicial `[]` y el efecto llama a `cargarEntregables` |
| Una petición por letra | El `fetch` no está en el efecto, o el efecto no tiene `[]` | Efecto con `[]` |
| `"listo"` entra | El JSON se leyó como `any` | `const datos: unknown` |

## Laboratorio

La demostración pidió la lista. Aquí pides un JSON de una sola frase, con otra función.

### Objetivo

Cargar `/aviso.json` y pintar su texto. La lista de entregables no sale de ese archivo.

### Código de partida

`cargarEntregables` y el efecto de la lista ya están. Si no, la demostración de esta página los trae.

### Qué haces

1. Crea `bandeja/public/aviso.json`.
2. En `api/entregables.ts`, añade `cargarAviso`. El cuerpo es `unknown` hasta comprobar `texto`.
3. En `App`, un estado `aviso` y un efecto con `[]` que lo guarda.
4. Pinta `{aviso}` bajo el título. Recarga. En Red hay dos peticiones: el JSON de la lista y `aviso.json`.
5. Escribe en «Buscar». No se repite `aviso.json`.

```json
{ "texto": "Cierre de bandeja a las 14 h." }
```

```tsx
export async function cargarAviso(): Promise<string> {
  const respuesta = await fetch("/aviso.json")
  if (!respuesta.ok) throw new Error(`Respuesta ${respuesta.status}`)
  const datos: unknown = await respuesta.json()
  if (
    typeof datos !== "object" ||
    datos === null ||
    typeof (datos as { texto?: unknown }).texto !== "string"
  ) {
    throw new Error("El aviso no tiene texto")
  }
  return (datos as { texto: string }).texto
}
```

→ Se lee «Cierre de bandeja a las 14 h.». Las seis fichas siguen viniendo de `entregables.json`.
