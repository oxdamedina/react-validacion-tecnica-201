# J04-02 — Re-renderizados

[← Página anterior](J04-01-impacto.md) · [Siguiente página →](J04-03-estado.md)

`memo` se salta el render si las props son iguales. La comparación se rompe si `marcar` es una función nueva en cada pintado. `useCallback` con `[]` deja esa función quieta.

## Demostración

### Objetivo

Hacer que teclear deje de ejecutar las fichas cuyo `item` no cambió.

### Fase 1 — El contador otra vez, sin memo

**Objetivo.** Partir de fichas que cuentan al teclear, con `marcar` escrito como función nueva en cada pintado.

Esta página mide el antes y el después con el mismo contador. `Tarjeta` lleva `console.count(item.id)` y todavía no está envuelta en `memo`. `marcar` es una `function` dentro de `App`, no un `useCallback`. Si llegas con el `memo` de un intento anterior, pega los dos archivos: si no, la fase 2 no tiene un «antes».

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

2. Sustituye `bandeja/src/componentes/Tarjeta.tsx` por este archivo y guarda. El contador ya está en la primera línea.

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
  console.count(item.id)
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

3. Recarga `http://localhost:5173`. F12, Consola. Vacía «Buscar».
4. Escribe una letra. Los id visibles suben.

**Validación**

- `Tarjeta` exporta la función tal cual, sin `memo`.
- `marcar` es una `function`, no un `useCallback`.
- Una letra hace subir los id que siguen en pantalla.

### Fase 2 — memo solo no calla

**Objetivo.** Comprobar que envolver la ficha en `memo` no basta mientras `marcar` nazca nueva en cada pintado.

`memo` compara las props con la vez anterior. `item` puede ser el mismo objeto, pero `alMarcar` es otra función cada vez que `App` se ejecuta. La comparación falla y la ficha se ejecuta igual. El contador lo enseña antes de tocar `useCallback`.

1. En `Tarjeta.tsx`, importa `memo` y cambia el export. La función y el `console.count` se quedan. Guarda.

```tsx
import { memo } from "react"
import type { Entregable } from "../modelo"
```

```tsx
function Tarjeta({
  item,
  textoBoton = "Anotar",
  alMarcar,
}: TarjetaProps) {
  console.count(item.id)
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

export default memo(Tarjeta)
```

2. Recarga. Limpia la pantalla de la consola si quieres leer mejor: el número no vuelve a cero hasta la recarga, y la recarga ya ha contado el primer pintado.
3. Escribe una letra en «Buscar».
4. Los id visibles siguen subiendo. `memo` está puesto y no ha callado las fichas.

**Validación**

- La última línea de `Tarjeta.tsx` es `export default memo(Tarjeta)`.
- Tras la letra, los id que siguen en pantalla han subido.
- En `App.tsx`, `marcar` sigue siendo una `function`.

### Fase 3 — La misma función en cada pintado

**Objetivo.** Dejar `marcar` quieta para que `memo` pueda saltarse las fichas cuyo `item` no cambió.

`useCallback` con `[]` guarda la función. `setItems` con la forma de actualizador no necesita estar en las dependencias: lee la lista vigente al pulsar. En el `map`, la prop tiene que ser esa función, `alMarcar={marcar}`. Una flecha escrita en la etiqueta sería otra referencia y el contador volvería.

1. En `App.tsx`, el import de React pasa a incluir `useCallback`.

```tsx
import { useCallback, useState } from "react"
```

2. Sustituye la `function marcar` por esto. Guarda.

```tsx
const marcar = useCallback((id: string): void => {
  setItems((lista) =>
    lista.map((item) =>
      item.id === id ? { ...item, estado: "revisado" } : item,
    ),
  )
}, [])
```

3. En el `map`, la etiqueta sigue siendo `<Tarjeta item={item} alMarcar={marcar} />`. Si en algún momento pusiste `alMarcar={(id) => marcar(id)}`, vuelve a `alMarcar={marcar}`.
4. Recarga. F12, Consola. Vacía «Buscar». Anota el número de `E-102` (ya está `revisado`, su objeto no va a cambiar al teclear).
5. Escribe una letra, `a`. El número de `E-102` no sube. Tampoco el de las otras fichas cuyo objeto no cambió. Puede subir el del primer pintado si recargaste con la letra ya puesta: haz la prueba con la caja vacía y luego la letra.
6. Borra la caja. Pulsa «Anotar E-101». Ese id sí sube. El botón pasa a «Hecho E-101». Un id que no marcaste, como `E-104`, no tiene por qué subir con ese clic.

**Validación**

- `export default memo(Tarjeta)`.
- `alMarcar={marcar}` y `marcar` es el `useCallback`.
- Una letra no hace subir los id cuyo objeto no cambió.
- Marcar E-101 hace subir `E-101`.
- Problems vacío.

Deja `memo`, `useCallback` y el `console.count`. El laboratorio de esta página usa los dos primeros. El contador se cambia por un `console.log` allí. La última página de la jornada quita el `console.count` si todavía está.

→ Con los dos, una letra no cuenta en las fichas que no cambian de objeto. Marcar E-101 cuenta esa ficha.

## Comprueba tu entendimiento

**Por qué memo solo no basta**
Sin `useCallback`, `marcar` es otra función en cada pintado.
→ `memo` compara la referencia y no se la salta.

## Reto

### 1 — Una flecha en la etiqueta

Pasa `alMarcar={(id) => marcar(id)}` en el `map`, aunque `marcar` esté en `useCallback`. Teclea. Vuelve a `alMarcar={marcar}`.

<details>
<summary>Ver solución</summary>

La flecha es nueva en cada pintado. El contador vuelve a subir. La prop tiene que ser la misma referencia.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Siguen contando todas | `memo` no está aplicado, o la prop es una flecha nueva | `export default memo(Tarjeta)` y `alMarcar={marcar}` |
| `useCallback` no está definido | Falta en el import | `import { useCallback, useState } from "react"` dentro del archivo que declara `marcar` |
| No sale `resumen` | `Resumen` no está en el `return` de `App`, o la consola filtra los log | `<Resumen texto={texto} />` debajo de la caja, y el nivel `Info` visible |
| Al teclear salen los id | `Tarjeta` volvió a ejecutarse | `export default memo(Tarjeta)`, `alMarcar={marcar}` y `marcar` dentro de `useCallback` |

## Laboratorio

La demostración aplicó `memo` a `Tarjeta` y `useCallback` a `marcar`. Aquí el hijo que no debe saltarse es otro: recibe el texto de la caja.

### Objetivo

`Resumen` se vuelve a ejecutar al teclear porque su prop `texto` cambia. `Tarjeta`, con `memo` y `useCallback`, no.

### Fase 1 — La ficha callada, el log preparado

**Objetivo.** Asegurar que `Tarjeta` ya se salta el render, y cambiar el contador por un log para ver el id solo si la ficha se ejecuta.

`console.count` acumula. `console.log(item.id)` escribe el id cada vez que la función corre y no escribe nada si `memo` se la salta. Antes de crear `Resumen` tienen que estar las tres piezas de la demostración. Si falta una, vuelve a la fase 3 de la demostración de esta página.

1. `bandeja/src/componentes/Tarjeta.tsx` termina en `export default memo(Tarjeta)`.
2. En `bandeja/src/App.tsx`, `marcar` está dentro de `useCallback` con `[]`.
3. En el `map`, la prop es `alMarcar={marcar}`. Si lees `alMarcar={(id) => marcar(id)}`, cámbiala a `alMarcar={marcar}` y guarda.
4. En `Tarjeta`, sustituye `console.count(item.id)` por esta línea y guarda.

```tsx
console.log(item.id)
```

5. Recarga. Vacía «Buscar». F12, Consola, y límpiala. Escribe `z`. No aparecen ids. La lista puede quedar vacía: `z` no coincide con ninguna ficha. Borra la `z`.

**Validación**

- Al teclear, la consola no escribe `E-101` ni ningún otro id.
- El export es `memo(Tarjeta)`.
- `alMarcar={marcar}`.

### Fase 2 — Un hijo que recibe el texto

**Objetivo.** Pintar el texto de la caja en otro componente, sin `memo`, y ver que ese componente sí se ejecuta al teclear.

`Resumen` recibe `texto`. Cada letra cambia esa prop. El log `"resumen"` sale porque la función se ha llamado. Las fichas, con el log de la fase 1, siguen en silencio.

1. Crea `bandeja/src/componentes/Resumen.tsx` con este contenido. Todavía no lleva `memo`.

```tsx
function Resumen({ texto }: { texto: string }) {
  console.log("resumen")
  return <p>Texto: {texto}</p>
}

export default Resumen
```

2. En `App.tsx`, importa el componente junto a `Tarjeta`.

```tsx
import Resumen from "./componentes/Resumen"
```

3. En el `return`, justo debajo del `input` de «Buscar» y antes de la lista:

```tsx
<Resumen texto={texto} />
```

4. Guarda los dos archivos. Recarga. Limpia la consola.
5. Haz clic en «Buscar» y escribe `a`.

En la página, debajo de la caja, se lee `Texto: a`. En la consola se lee `resumen`. No se leen ids. StrictMode puede escribir `resumen` dos veces por la misma letra. Sigue siendo el párrafo, no las fichas.

**Validación**

- Se lee `Texto: a`.
- La consola muestra `resumen`.
- La consola no muestra `E-101`, `E-102` ni el resto de ids.

### Fase 3 — memo no calla a Resumen

**Objetivo.** Ver que `memo(Resumen)` sigue ejecutándolo, porque `texto` es otro en cada letra.

`memo` compara props. `"a"` y `"ab"` no son el mismo string, así que `Resumen` se ejecuta. El `item` de cada ficha es el mismo objeto y `marcar` es la misma función, así que `Tarjeta` no.

1. Sustituye `Resumen.tsx` por este archivo y guarda.

```tsx
import { memo } from "react"

function Resumen({ texto }: { texto: string }) {
  console.log("resumen")
  return <p>Texto: {texto}</p>
}

export default memo(Resumen)
```

2. Limpia la consola. Escribe otra letra, `b`, sin borrar la caja.
3. La página pasa a `Texto: ab`. La consola vuelve a escribir `resumen`. Los id siguen sin salir.

Al terminar puedes borrar el import, la etiqueta `<Resumen />` y el archivo `Resumen.tsx`. Si los dejas, la página siguiente que diga que pegues `App.tsx` quitará la etiqueta al sustituir ese archivo. `memo` y `useCallback` de `Tarjeta` se quedan.

**Validación**

- Con la caja en `ab`, la consola muestra `resumen`.
- Con la caja en `ab`, la consola no muestra ids.
- `Tarjeta` sigue exportada con `memo`.
- `alMarcar={marcar}`.

→ «resumen» sale al teclear. Los id de las fichas no. `memo(Resumen)` no calla el log: la prop `texto` cambió.
