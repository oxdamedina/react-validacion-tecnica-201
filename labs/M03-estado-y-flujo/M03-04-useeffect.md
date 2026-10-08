# M03-04 — useEffect

[← Página anterior](M03-03-flujo.md) · [Siguiente página →](M03-05-reglas.md)

> Práctica de [useEffect y las reglas](../M02-estado-y-hooks/03-efecto.md).

### Objetivo

Llevar el número de pendientes al título de la pestaña, y ver qué pasa si el array de dependencias miente.

### Código de partida

Este laboratorio no continúa el archivo que tengas a medias. `bandeja/src/datos.ts` y `bandeja/src/modelo.ts` se quedan como están en el repo. Sustituye `bandeja/src/App.tsx` y `bandeja/src/componentes/Tarjeta.tsx` por estos dos archivos. Si ya coinciden, no cambies nada y pasa al paso 1.

`App.tsx` tiene buscador, filtro y `marcar`. No tiene `useEffect`. La pestaña del navegador dice «Bandeja de entregables».

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

Al guardar, `Este` deja «Inventario de componentes». «Anotar E-101» pasa esa pastilla a `revisado`. La pestaña sigue sin número.

### En qué consiste

Un efecto. El experimento vacía las dependencias, filtra y marca, y anota qué cambia y qué no.

### 1 — El efecto

**Dónde:** `App.tsx`, justo después de `visibles`. El import pasa a incluir `useEffect`.

**Qué haces:**

1. Calcula `pendientes` a partir de `items`, no de `visibles`.
2. Añade el efecto con `[pendientes]`.
3. Guarda.
4. Mira el texto de la pestaña del navegador, no el `<h1>`.

```tsx
import { useEffect, useState } from "react"
```

```tsx
const pendientes = items.filter((item) => item.estado === "pendiente").length

useEffect(() => {
  document.title = `Pendientes: ${pendientes}`
}, [pendientes])
```

**Experimento:**

1. Escribe `Sur` en «Buscar». Lee la pestaña y cuenta fichas.
2. Borra el filtro. Marca E-101. Lee la pestaña.
3. Cambia el array a `[]`, guarda, recarga y marca E-103. Lee la pestaña.
4. Devuelve `[pendientes]`, recarga y marca otra vez.

→ Con `Sur` hay dos fichas y la pestaña sigue en «Pendientes: 3». Filtrar no cambia `estado`. Al marcar E-101, la pestaña baja a 2. Con `[]`, la pestaña se queda en 3 aunque la pastilla cambie. Con `[pendientes]`, vuelve a acompañar a la marca.

**Validación:**

- Al recargar, la pestaña dice «Pendientes: 3».
- El `<h1>` sigue siendo «Bandeja de entregables».
- `pendientes` no sale de `visibles`. Si lo contaras sobre la lista filtrada, escribir `Sur` cambiaría el título.
- Problems vacío. `useEffect` está importado.

## Comprueba tu entendimiento

**El efecto no pinta la lista**
`visibles` sigue siendo un `const` fuera del efecto.
→ El filtro responde al teclear aunque el efecto solo escriba en `document.title`.

## Reto

### 1 — La limpieza

Devuelve una función que escriba `limpieza` en la consola y deje el título en «Bandeja de entregables». Marca un pendiente y lee la consola. Puedes dejar la limpieza.

<details>
<summary>Ver solución</summary>

```tsx
useEffect(() => {
  document.title = `Pendientes: ${pendientes}`
  return () => {
    document.title = "Bandeja de entregables"
    console.log("limpieza")
  }
}, [pendientes])
```

Al marcar, la consola escribe `limpieza` y enseguida el efecto vuelve a poner «Pendientes: N». La limpieza corre antes de repetir el efecto.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| `useEffect is not defined` | El import no lo nombra | `import { useEffect, useState } from "react"` |
| El título no baja al marcar | Dependencias `[]`, o cuentas otra lista | `[pendientes]` y `item.estado === "pendiente"` sobre `items` |
| Miras el h1 y no ves el número | El título es el de la pestaña | Lee la pestaña del navegador |
| El archivo no tiene buscador | No partiste del código de arriba | Sustituye `App.tsx` por el bloque de «Código de partida» |
