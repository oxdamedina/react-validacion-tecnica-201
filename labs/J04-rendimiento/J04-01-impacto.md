# J04-01 — Qué impacta

[← Página anterior](README.md) · [Siguiente página →](J04-02-rerender.md)

React pinta en dos momentos. El render llama a las funciones. El commit aplica el árbol al documento. Si el estado vive en el padre, un `setTexto` vuelve a ejecutar al padre y a los hijos. `console.count` cuenta esas llamadas. No dice que la página vaya lenta.

## Demostración

### Objetivo

Contar cuántas veces se ejecuta `Tarjeta` al teclear y al marcar, antes de optimizar.

### Fase 1 — La bandeja de esta página

**Objetivo.** Dejar `App` y `Tarjeta` como los de esta hoja, con seis fichas y la caja «Buscar», sin contador y sin `memo`.

El contador de la fase siguiente mide estas funciones. Si en los archivos queda un `memo`, un `useCallback` o un `console.count` de otra página, el número no corresponde a este punto de partida. Sustituyes los dos archivos enteros y recargas.

1. En `bandeja/`, con `npm run dev` en marcha, abre `http://localhost:5173`.
2. Sustituye `bandeja/src/App.tsx` por este archivo y guarda.

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

3. Sustituye `bandeja/src/componentes/Tarjeta.tsx` por este archivo y guarda.

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

4. Recarga `http://localhost:5173`. Vacía la caja si tiene texto.

**Validación**

- Se leen seis fichas, de E-101 a E-106.
- Hay una caja con la etiqueta «Buscar».
- E-101, E-103 y E-105 dicen «Anotar» y `pendiente`. E-102 ya dice «Hecho».
- En `Tarjeta.tsx` no hay `console.count` ni `memo`.

### Fase 2 — Una letra, todas las fichas visibles

**Objetivo.** Ver que una letra vuelve a ejecutar cada `Tarjeta` que sigue en pantalla.

El estado del texto vive en `App`. Cada letra hace `setTexto`, React vuelve a llamar a `App` y, desde el `map`, a cada ficha visible. El contador va en la primera línea del cuerpo de `Tarjeta`, antes del `return`. Ahí corre en cada llamada. Fuera de la función el archivo lo evaluaría una vez al cargarlo y la consola no subiría al teclear. El número cuenta llamadas. La bandeja se ve igual.

1. En `Tarjeta.tsx`, la función queda así en su arranque. El `return` no se toca. Guarda.

```tsx
export default function Tarjeta({
  item,
  textoBoton = "Anotar",
  alMarcar,
}: TarjetaProps) {
  console.count(item.id)
  return (
```

2. Recarga con F5. El número de `console.count` vuelve a cero solo al recargar. Limpiar la consola borra las líneas y deja el número donde estaba.
3. F12, pestaña Consola. El filtro de niveles deja pasar `Info`.
4. Antes de teclear ya pueden leerse `E-101: 1` o `E-101: 2`, y lo mismo en los otros id. Es el primer pintado. `main.tsx` envuelve la app en `StrictMode` y en desarrollo ese pintado puede contar dos veces.
5. Haz clic en «Buscar». Escribe una sola letra, `n`.
6. Mira la consola. Cada id que sigue en pantalla sube un paso (de 2 a 3, o de 2 a 4 si StrictMode dobla también esa ejecución). Suben las seis, porque `n` está vacío de filtro útil: las seis fichas siguen visibles. No mires un único total de seis saltos en una sola línea: hay una línea por id.
7. Borra la letra. Los mismos id suben otro paso. La lista vuelve a las seis fichas.

**Validación**

- Tras la letra, cada id visible ha subido.
- La página se ve igual que antes del contador: títulos, pastillas y botones en su sitio.
- `console.count(item.id)` sigue en `Tarjeta`. La fase 3 lo usa.

### Fase 3 — Marcar también arrastra a las demás

**Objetivo.** Ver que el clic en una ficha pendiente vuelve a ejecutar a las que siguen en pantalla.

`marcar` vive en `App` y hace `setItems`. El padre se ejecuta otra vez y el `map` vuelve a llamar a las fichas visibles. Anotas el id que más crece para ver que no crece solo el de la ficha pulsada.

1. Sin recargar, anota el número que muestra ahora `E-101` y el de otra ficha, por ejemplo `E-104`.
2. Pulsa el botón que dice exactamente «Anotar E-101», en «Informe de accesibilidad». E-103 y E-105 también dicen «Anotar»: no valen para esta lectura.
3. El botón pasa a «Hecho E-101». La pastilla dice `revisado`. Desaparece «Falta revisión» en esa ficha.
4. En la consola, `E-101` ha subido. `E-104` también, y el resto de ids que siguen a la vista. La ficha marcada no es la única.

**Validación**

- «Hecho E-101» está en pantalla.
- Al menos dos id distintos han subido con ese clic.
- La línea `console.count(item.id)` sigue en `Tarjeta` hasta que el laboratorio de esta página la quite.

→ Una letra, y un clic, vuelven a ejecutar las fichas que siguen en pantalla. El padre se ha ejecutado y ha vuelto a pintar la lista. No has envuelto nada en `memo`.

## Comprueba tu entendimiento

**Qué no dice el número**
`console.count` no es un tiempo.
→ Dice cuántas veces se llamó a la función. No dice si la página va lenta.

## Reto

### 1 — La ficha que el filtro quita

Escribe `Norte` y compara el contador de una ficha visible con el de una que desaparece.
→ La que desaparece deja de contar hasta que vuelve.

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| No cuenta | El `count` está fuera de la función | Primera línea del cuerpo de `Tarjeta` |
| No hay caja | `App` no filtra | Pega el archivo de la fase 1 |
| Al teclear sale `App: 6` | El `count("App")` está dentro del `map`, en cada ficha | Primera línea de la función `App`, antes de los `useState` |
| La consola sigue contando al borrar la línea | Quedó el `console.count` de `Tarjeta` | Bórralo también en `Tarjeta.tsx` y guarda |

## Laboratorio

La demostración contó ejecuciones dentro de `Tarjeta`. Aquí cuentas en `App`, para ver una sola llamada del padre.

### Objetivo

Dejar claro que una letra ejecuta `App` una vez, aunque las fichas sean seis.

### Fase 1 — La consola solo habla del padre

**Objetivo.** Quitar el contador de `Tarjeta` para que las líneas de las fichas no se mezclen con las de `App`.

Si `console.count(item.id)` se queda, al teclear verás seis id y además `App`. Esta fase deja la ficha en silencio. La caja y el `map` siguen como en la demostración.

1. Abre `bandeja/src/componentes/Tarjeta.tsx`.
2. Borra la línea `console.count(item.id)`. El `return` no se toca. Guarda.
3. Recarga `http://localhost:5173`. F12, Consola.
4. Escribe una letra en «Buscar». La consola no escribe ids.

**Validación**

- `Tarjeta.tsx` no contiene `console.count`.
- La caja «Buscar» sigue filtrando.
- Siguen las seis fichas cuando la caja está vacía.

### Fase 2 — Una letra, un salto de App

**Objetivo.** Ver que el padre sube una vez por letra, no una vez por ficha.

`console.count("App")` va en la primera línea del cuerpo de `App`, antes de los `useState`. Ahí la función se cuenta una vez por ejecución. Dentro del `map` se contaría una vez por ficha y verías un salto de seis.

1. Abre `bandeja/src/App.tsx`. El arranque de la función queda así. Guarda.

```tsx
export default function App() {
  console.count("App")
  const [texto, setTexto] = useState("")
```

2. Recarga con F5. F12, Consola. El nivel `Info` está visible.
3. Antes de teclear ya puede leerse `App: 1` o `App: 2`. Es el primer pintado, doblado si StrictMode repite el render de desarrollo.
4. Haz clic en «Buscar». Escribe una sola letra, `n`.
5. El número sube un paso: de 2 a 3, de 2 a 4, o el salto que te haya tocado. Sube una vez por la letra, o dos si StrictMode dobla también esa ejecución. No sube seis.
6. Sin recargar, escribe otra letra, `o`. El número sube el mismo paso otra vez. En pantalla siguen las fichas que coinciden con `no`. La página no se siente más lenta.

**Validación**

- Tras la primera letra el número de `App` subió un paso, no seis.
- Tras la segunda letra subió ese mismo paso, otra vez.
- No hay líneas `E-101`, `E-102` ni del resto de ids.

### Fase 3 — Quitar el contador del padre

**Objetivo.** Dejar `App` sin `console.count` antes de la página siguiente.

La lectura ya está hecha. La línea de depuración no se queda en el archivo.

1. Borra `console.count("App")` de `App.tsx`. Guarda.
2. Recarga. Escribe `p` en «Buscar».
3. La consola no escribe `App`.
4. Vacía la caja.

**Validación**

- `App.tsx` no contiene `console.count`.
- `Tarjeta.tsx` tampoco.
- El filtro sigue respondiendo con la caja vacía: vuelven las seis fichas.

→ El contador que subía era el del padre. Las seis fichas son hijas de esa ejecución. StrictMode puede doblar el número: mira que suba al teclear, no el valor exacto.
