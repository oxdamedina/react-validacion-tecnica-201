# J04-03 — Estado y referencias

[← Página anterior](J04-02-rerender.md) · [Siguiente página →](J04-04-lazy.md)

`useMemo` fija el resultado de un cálculo. No acelera las seis fichas. Se nota cuando falta `texto` en las dependencias: la caja cambia y las fichas no. Entregar un objeto nuevo en `marcar` es lo que permite el repintado.

## Demostración

### Objetivo

Ver que un `useMemo` sin `texto` miente, y que al devolver `texto` el filtro vuelve. En seis fichas no hay una ganancia que contar.

### Fase 1 — El filtro como const

**Objetivo.** Dejar `visibles` calculado en cada pintado, sin `useMemo`, para tener con qué comparar.

Esta fase borra el `memo` y el `useCallback` si la página anterior los dejó en estos dos archivos. El experimento de las dependencias se lee en la lista, no en el contador.

1. Sustituye `bandeja/src/App.tsx` por este archivo y guarda.

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

2. Sustituye `bandeja/src/componentes/Tarjeta.tsx` por este archivo y guarda.

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

3. Recarga `http://localhost:5173`. Vacía «Buscar». Escribe `Norte`.

**Validación**

- Quedan dos fichas: «Informe de accesibilidad» (E-101) y «Manual de operación» (E-103).
- `visibles` es un `const`, no un `useMemo`.
- Vacía la caja: vuelven las seis fichas.

### Fase 2 — Las dos dependencias

**Objetivo.** Envolver el filtro en `useMemo` con `[items, texto]` y ver que `Norte` sigue filtrando igual que el `const`.

Con las dos dependencias el cálculo se rehace cuando cambia la lista o la caja. En seis fichas el resultado es el mismo que sin `useMemo`. Esta fase deja esa forma escrita para romperla en la siguiente.

1. En `App.tsx`, amplía el import. No añadas una segunda línea `from "react"`.

```tsx
import { useMemo, useState } from "react"
```

2. Sustituye el `const visibles` por esto. Guarda.

```tsx
const visibles = useMemo(
  () =>
    items.filter((item) => {
      const blob = `${item.titulo} ${item.proveedor} ${item.id}`.toLowerCase()
      return blob.includes(texto.toLowerCase())
    }),
  [items, texto],
)
```

3. Recarga. Vacía la caja. Escribe `Norte`.

**Validación**

- Otra vez E-101 y E-103.
- El array de dependencias es `[items, texto]`.
- Problems no marca ese array.

### Fase 3 — Quitar texto

**Objetivo.** Ver que, sin `texto` en el array, la caja escribe y las fichas no se mueven.

`useMemo` rehace el filtro solo cuando cambia algo del array. Si `texto` no está, la primera lista queda guardada. El editor puede avisar de que `texto` se usa y no está en las dependencias. El aviso describe esta fase. No lo arregles todavía.

1. Deja el array en `[items]`. Guarda.

```tsx
  [items],
```

2. Vacía «Buscar». Recarga con la caja vacía. El memo tiene que nacer con las seis fichas. Si recargas con `Norte` ya escrito, guarda el filtro y no verás la mentira.
3. Escribe `Norte`.
4. La caja muestra `Norte`. Las seis fichas siguen. No aparecen solo las de ese proveedor.

**Validación**

- El array es `[items]`.
- Con `Norte` en la caja, siguen las seis fichas.
- El aviso del editor, si sale, nombra `texto`.

### Fase 4 — Devolver texto

**Objetivo.** Restituir `texto` y ver que `Norte` vuelve a filtrar.

La lista no se ha acelerado. Has visto para qué estaba la dependencia.

1. El array vuelve a `[items, texto]`. Guarda.
2. La caja sigue con `Norte`, o la escribes otra vez.
3. Quedan E-101 y E-103.
4. Vacía la caja. Vuelven las seis.
5. `marcar` sigue con el `map` y `{ ...item, estado: "revisado" }`. No lo cambies en esta fase: ese objeto nuevo es el que permite pintar la pastilla. El reto de esta página lo rompe a propósito.

**Validación**

- Las dependencias son `[items, texto]`.
- `Norte` deja dos fichas.
- `marcar` sigue creando un objeto nuevo.
- Problems vacío.

→ Al restituir `texto`, `Norte` vuelve a filtrar. En seis fichas no hay una ganancia que contar. El `useMemo` sirvió para ver la dependencia rota.

## Comprueba tu entendimiento

**Qué no acelera**
El filtro con `[items, texto]` se ve igual que el `const`.
→ No se celebra el `useMemo` en esta lista. Se sabe por qué estaba la dependencia.

## Reto

### 1 — Mutar otra vez

En `marcar`, devuelve el mismo array mutado. Pulsa una ficha. Restaura el `map`.

<details>
<summary>Ver solución</summary>

La pastilla puede no cambiar: la referencia del array es la misma. El `map` con `{ ...item }` entrega un objeto nuevo y la pastilla cambia.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| El filtro no vuelve | El array se quedó en `[items]` | `[items, texto]` |
| `useMemo` no está definido | Falta en el import de `App` | Añádelo junto a `useState` |
| Con `[]` el párrafo ya nace filtrado | Escribiste `Norte` antes de recargar | Vacía la caja, guarda el `[]`, recarga, y luego escribe `Norte` |
| Con `[visibles]` el párrafo no filtra | El `useMemo` de `ids` sigue en `[]` | El array de `ids` es `[visibles]` |

## Laboratorio

La demostración memorizó `visibles` y rompió la dependencia `texto`. Aquí memorizas la lista de ids. La dependencia que miente es la de ese segundo `useMemo`: si la dejas en `[]`, el párrafo no se entera del filtro.

### Objetivo

Un párrafo `Ids: …` que sigue a las fichas cuando depende de `visibles`, y que se queda en los seis id cuando el array está vacío.

### Fase 1 — El párrafo con los seis id

**Objetivo.** Pintar los id visibles en un párrafo que depende de `visibles`.

El párrafo no incluye el estado, solo el id. Por eso marcar una ficha puede dejar la frase igual: el id sigue en la lista. El cálculo va justo debajo de `visibles`, que puede ser un `const` o un `useMemo` con `[items, texto]`. Las dos formas sirven.

1. En `App.tsx`, el import incluye `useMemo`. Si la demostración ya lo puso, no lo dupliques.

```tsx
import { useMemo, useState } from "react"
```

2. `marcar` sigue copiando el objeto con `{ ...item, estado: "revisado" }`.
3. Vacía «Buscar» y recarga, para partir de las seis fichas.
4. Justo debajo de `visibles`, añade este cálculo.

```tsx
const ids = useMemo(
  () => visibles.map((item) => item.id).join(", "),
  [visibles],
)
```

5. En el `return`, debajo del `input` y antes de la lista:

```tsx
<p>Ids: {ids}</p>
```

6. Guarda.

**Validación**

- Encima de las fichas se lee `Ids: E-101, E-102, E-103, E-104, E-105, E-106`.
- El array de `ids` es `[visibles]`.
- Hay seis fichas.

### Fase 2 — Marcar no cambia esa frase

**Objetivo.** Ver que «Anotar E-101» cambia la pastilla y deja el párrafo con los mismos seis id.

La frase no lleva el estado. E-101 sigue visible. Que el párrafo no cambie es lo esperado en esta fase. La mentira de las dependencias llega en la fase 3, al filtrar, no al marcar.

1. Pulsa el botón «Anotar E-101».
2. Mira la pastilla y el botón de esa ficha.
3. Lee el párrafo.

**Validación**

- La pastilla de E-101 dice `revisado`.
- El botón dice «Hecho E-101».
- El párrafo sigue con los seis id, en el mismo orden.

### Fase 3 — El array vacío se queda viejo

**Objetivo.** Dejar el `useMemo` de `ids` con `[]` y ver que `Norte` filtra las fichas mientras el párrafo conserva los seis id.

El memo guarda el resultado del primer pintado y no vuelve a leer `visibles`. Hay que recargar con la caja vacía. Si recargas con `Norte` ya escrito, el párrafo nace filtrado y el experimento no se ve.

1. Deja el array de `ids` vacío. Guarda.

```tsx
const ids = useMemo(
  () => visibles.map((item) => item.id).join(", "),
  [],
)
```

2. Vacía «Buscar» si tiene algo.
3. Recarga con F5, con la caja vacía. El párrafo tiene que mostrar los seis id antes de escribir.
4. Escribe `Norte`.
5. El editor puede avisar de que `visibles` se usa y no está en el array. El aviso describe esta mentira. No lo arregles todavía.

**Validación**

- En la lista quedan «Informe de accesibilidad» (E-101) y «Manual de operación» (E-103).
- El párrafo sigue diciendo `Ids: E-101, E-102, E-103, E-104, E-105, E-106`.

### Fase 4 — Restaurar la dependencia

**Objetivo.** Devolver `[visibles]` y ver que el párrafo se pone al día con `Norte`.

Con la dependencia correcta, el párrafo y las fichas cuentan lo mismo.

1. El array de `ids` vuelve a `[visibles]`. Guarda.
2. La caja sigue con `Norte`.
3. Lee el párrafo.
4. Borra la caja y lee el párrafo otra vez.
5. Si no quieres dejar el párrafo en la página, borra `<p>Ids: {ids}</p>` y el `useMemo` de `ids`. `visibles` se queda como estaba al empezar este laboratorio.

**Validación**

- Con `Norte`, el párrafo dice `Ids: E-101, E-103`.
- Con la caja vacía, el párrafo vuelve a los seis id y hay seis fichas.
- Problems no marca el array `[visibles]`.

→ Con `[visibles]`, `Norte` cambia el párrafo. Con `[]`, la caja filtra las fichas y los id escritos se quedan en la primera lista.
