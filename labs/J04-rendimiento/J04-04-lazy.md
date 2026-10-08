# J04-04 — Lazy loading

[← Página anterior](J04-03-estado.md) · [Siguiente página →](J04-05-devtools.md)

`lazy` parte el paquete. El trozo llega cuando se muestra. `Suspense` enseña un respaldo mientras llega. El pie de la bandeja basta para ver el mecanismo.

## Demostración

### Objetivo

Cargar un componente en otro archivo del paquete, con un respaldo mientras llega.

### Fase 1 — La lista sin pie

**Objetivo.** Dejar la bandeja en el punto de partida, sin `Pie.tsx`.

El pie se crea en la fase siguiente. Si ya existe de un intento anterior, no lo importes todavía: esta fase comprueba que la lista sola filtra.

1. Sustituye `bandeja/src/App.tsx` y `bandeja/src/componentes/Tarjeta.tsx` por los dos archivos de abajo. Guarda los dos.
2. Si existe `bandeja/src/componentes/Pie.tsx`, no lo borres aún. No debe haber un `import` de `Pie` en `App`.
3. Recarga `http://localhost:5173`.

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

**Validación**

- Hay seis fichas y la caja «Buscar».
- Debajo de la lista no se lee «Lista de entregables.».
- `App.tsx` no menciona `Pie`.

### Fase 2 — El pie en otro archivo

**Objetivo.** Crear `Pie` y pedirlo con `lazy`, envuelto en `Suspense`, debajo de la lista.

`lazy` va junto a los import, fuera de la función `App`. Ahí se declara una vez. Dentro de `App` nacería otro componente en cada pintado y el respaldo no se asentaría. `Suspense` es el límite que enseña «Cargando el pie…» mientras el archivo llega. El archivo es pequeño: el respaldo puede cruzar la pantalla tan rápido que no llegues a leerlo.

1. Crea `bandeja/src/componentes/Pie.tsx`.

```tsx
export default function Pie() {
  return <p>Lista de entregables.</p>
}
```

2. En `App.tsx`, deja un solo import de React.

```tsx
import { lazy, Suspense, useState } from "react"
```

3. Debajo de los import, antes de `export default function App`:

```tsx
const Pie = lazy(() => import("./componentes/Pie"))
```

4. En el `return`, después de `</ul>` y antes de `</main>`:

```tsx
<Suspense fallback={<p>Cargando el pie…</p>}>
  <Pie />
</Suspense>
```

5. Guarda. Recarga.

**Validación**

- Debajo de las fichas se lee «Lista de entregables.».
- `Pie` no está importado con un `import` normal además del `lazy`.
- Escribe `Norte`: siguen filtrando E-101 y E-103, y el pie sigue debajo. Vacía la caja.
- Problems vacío.

### Fase 3 — El archivo del pie en la red

**Objetivo.** Ver en la pestaña Red que `Pie` llega como un archivo distinto del de `App`.

En desarrollo, Vite muestra el nombre del módulo. Buscas una fila cuyo nombre contenga `Pie`. Las demás filas `.js` son el resto de la página.

1. F12, pestaña Red. Pulsa el icono de prohibido para vaciar la lista.
2. En la barra de filtros pulsa `JS`.
3. Recarga con esa pestaña abierta.
4. En la columna Nombre, localiza una fila que contenga `Pie`.

**Validación**

- Hay una fila `Pie` después de recargar.
- Esa fila no se llama `App`.
- El pie sigue leyéndose bajo la lista.

### Fase 4 — Una ruta que no existe

**Objetivo.** Ver qué ocurre si `lazy` apunta a un archivo que no está, y dejar otra vez la ruta buena.

Con la ruta mala, el módulo no resuelve. El respaldo puede quedarse, o la consola muestra el fallo del import. Al restaurar `./componentes/Pie`, vuelve la frase.

1. En el `lazy`, cambia la ruta a `./componentes/NoEsta`. Guarda. Recarga.
2. Lee la página y la consola.
3. Restaura `./componentes/Pie`. Guarda. Recarga.

Puedes dejar el pie. El laboratorio de esta página no lo reutiliza: crea otro archivo.

**Validación**

- Con `./componentes/Pie`, se lee «Lista de entregables.».
- La consola no muestra el fallo del módulo.
- La lista sigue filtrando.

→ Con la ruta mala, el respaldo se queda o la consola muestra el fallo del módulo. Con la ruta buena, se lee «Lista de entregables.» bajo la lista. El respaldo puede no llegar a verse: el archivo es pequeño.

## Comprueba tu entendimiento

**Qué no acelera**
El pie no quita trabajo al filtro.
→ Parte el paquete. En esta pantalla no hay un panel pesado que justificar.

## Reto

### 1 — Sin Suspense

Quita `Suspense` y deja el `lazy`. Lee la consola. Vuelve a envolverlo.

<details>
<summary>Ver solución</summary>

React avisa de que falta un límite de `Suspense`. El pie vuelve a ir dentro.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| `Pie is not defined` | Falta el `const Pie = lazy(...)` | El `lazy` está en `App`, no dentro del `return` |
| El respaldo no desaparece | La ruta del import no resuelve | `./componentes/Pie` |
| `Ayuda` sale en Red al recargar | La etiqueta está siempre en el `return`, sin el `abierta ?` | Envuelve `<Ayuda />` en `{abierta ? ( … ) : null}` |
| El botón no pide ningún archivo | `lazy` está dentro de la función `App` | `const Ayuda = lazy(...)` va junto a los import, fuera del componente |

## Laboratorio

La demostración cargó el pie al arrancar la página. Aquí el trozo llega solo si pulsas un botón.

### Objetivo

`Ayuda` entra con `lazy` cuando `abierta` pasa a verdadero. El respaldo dice «Abriendo ayuda…».

### Fase 1 — El archivo, todavía sin usarlo

**Objetivo.** Crear `Ayuda.tsx` sin montarlo, para que la red no lo pida al recargar.

El componente existe en disco y `App` aún no lo nombra. El pie de la demostración, si sigue en la página, no sirve para este ejercicio: la fila que vas a buscar se llama `Ayuda`.

1. Crea `bandeja/src/componentes/Ayuda.tsx`.

```tsx
export default function Ayuda() {
  return <p>La marca vive en memoria hasta que recargas.</p>
}
```

2. Guarda. Recarga `http://localhost:5173`.
3. Busca en la página la frase del archivo. No está: nadie ha puesto la etiqueta.

**Validación**

- El archivo existe en `bandeja/src/componentes/Ayuda.tsx`.
- La página no dice «La marca vive en memoria hasta que recargas.».
- La lista de fichas sigue en su sitio.

### Fase 2 — El botón que lo pide

**Objetivo.** Declarar el `lazy` fuera de `App` y pintar `Ayuda` solo cuando `abierta` es verdadero.

Dentro de la función, `lazy(...)` crearía un componente nuevo en cada pintado. Junto a los import se declara una vez. El botón pone `abierta` a verdadero. Hasta ese clic, la condición `{abierta ? … : null}` no monta `Suspense` ni `Ayuda`.

1. En `App.tsx`, deja un solo import de React. Si ya tenías `useState` y `lazy` por el pie, amplía esa línea. No añadas una segunda línea `from "react"`.

```tsx
import { lazy, Suspense, useState } from "react"
```

2. Debajo de los import, antes de `export default function App`:

```tsx
const Ayuda = lazy(() => import("./componentes/Ayuda"))
```

3. Dentro de `App`, junto a los otros `useState`:

```tsx
const [abierta, setAbierta] = useState(false)
```

4. En el `return`, después de `</ul>` y antes de `</main>`. Si el pie sigue ahí, deja el pie y pon el botón debajo.

```tsx
<button type="button" onClick={() => setAbierta(true)}>
  Ayuda
</button>
{abierta ? (
  <Suspense fallback={<p>Abriendo ayuda…</p>}>
    <Ayuda />
  </Suspense>
) : null}
```

5. Guarda. Recarga.

**Validación**

- Se ve el botón «Ayuda».
- No se lee «La marca vive en memoria hasta que recargas.».
- No se lee «Abriendo ayuda…».
- `const Ayuda = lazy(...)` está fuera de la función `App`.

### Fase 3 — La red antes del clic

**Objetivo.** Comprobar que, al recargar, el archivo `Ayuda` todavía no se pide.

El filtro `JS` deja los scripts. `Pie` puede salir si la demostración sigue cargándolo al arrancar. Esa fila no cuenta. La que buscas contiene `Ayuda`, y no debe estar.

1. F12, pestaña Red. Pulsa el icono de prohibido para vaciar la lista.
2. Pulsa el filtro `JS`.
3. Recarga con la pestaña Red abierta.
4. Recorre la columna Nombre.

**Validación**

- Ninguna fila contiene `Ayuda`.
- El botón «Ayuda» está en la página.
- La frase de la marca no está.

### Fase 4 — El clic

**Objetivo.** Pedir el trozo al pulsar y leer la frase cuando el módulo ha llegado.

Al pulsar, `abierta` pasa a verdadero, `Suspense` monta `Ayuda` y el navegador pide ese archivo. «Abriendo ayuda…» puede ir tan rápido que no lo leas. La frase final y la fila nueva bastan. Un segundo clic no pide otro archivo: `abierta` ya es verdadero.

1. Sin vaciar la lista de Red, pulsa «Ayuda».
2. Busca una fila nueva cuyo nombre contenga `Ayuda`.
3. Lee el párrafo debajo del botón.
4. Pulsa «Ayuda» otra vez y mira si aparece una segunda fila de ese archivo.

Al acabar puedes dejar el botón o quitar el estado, el `lazy`, la etiqueta y el archivo `Ayuda.tsx`.

**Validación**

- Hay una fila cuyo nombre contiene `Ayuda`, distinta de `App`.
- Se lee «La marca vive en memoria hasta que recargas.».
- El segundo clic no añade otra fila `Ayuda`.
- La lista de fichas sigue en `App`, no dentro de `Ayuda.tsx`.

→ Antes del clic no está el párrafo ni su archivo. Después del clic se lee la frase. La lista no se ha ido a ese trozo.
