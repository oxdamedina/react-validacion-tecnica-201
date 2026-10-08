# J04-06 — Profiler

[← Página anterior](J04-05-devtools.md) · [Siguiente página →](J04-07-lighthouse.md)

El Profiler pregunta qué componente se ejecutó y cuánto tardó el render. Hace falta la extensión React DevTools. No sustituye a Network.

## Demostración

### Objetivo

Grabar un pintado y ver qué componente se ejecutó al teclear.

### Fase 1 — La extensión, o el contador

**Objetivo.** Tener la bandeja de esta página y un sitio donde leer el render: el Profiler, o la consola si la extensión no está.

Estos dos archivos no llevan `memo`. Una letra vuelve a ejecutar las fichas. Si te saltas el pegado y aún tienes el `memo` de J04-02, una letra puede no ejecutar las fichas cuyo `item` no cambió: dilo al leer la grabación, no lo corrijas para «llenar» la barra.

La pestaña Profiler lleva el logo de React y está al lado de Components. No es Rendimiento (Performance). Esa no lista `Tarjeta`.

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

3. Recarga `http://localhost:5173`. Vacía «Buscar».
4. F12. Busca las pestañas con el logo de React.
5. Si no están, instala React Developer Tools en ese navegador y recarga. Si no puedes instalarla, pasa a la fase 4 y usa el contador. Las fases 2 y 3 piden el Profiler.

**Validación**

- Hay seis fichas y la caja «Buscar».
- O ves Profiler junto a Components, o has decidido seguir por la fase 4.
- No has envuelto `Tarjeta` en `memo` para esta grabación, salvo que anotes que te saltaste el pegado.

### Fase 2 — Grabar una letra

**Objetivo.** Dejar un commit que corresponda a una letra en «Buscar», no a la recarga.

Hay dos controles redondos. El círculo de grabar registra lo que hagas en la página ya abierta. El otro recarga y empieza a grabar: esa barra sería el primer pintado, no la letra.

1. Abre Profiler.
2. Pulsa el círculo de grabar. La página no se recarga.
3. Haz clic en «Buscar». Escribe una letra, `n`.
4. Pulsa el mismo círculo para parar.

**Validación**

- Hay al menos una barra de commit.
- La caja contiene `n` y las fichas siguen en pantalla.
- No has cambiado código mientras grababas.

### Fase 3 — Leer App y Tarjeta

**Objetivo.** En el commit de esa letra, encontrar `App` y las `Tarjeta` que se ejecutaron.

El estado de la caja vive en `App`, así que `App` sale. `Tarjeta` sale en las que se volvieron a ejecutar. Con los archivos de la fase 1, sin `memo`, son las que siguen en pantalla. Pulsa la barra de la letra. Si hay varias, la última es el tecleo.

1. Pulsa la barra de esa grabación.
2. En el gráfico, localiza el nombre `App`.
3. Localiza `Tarjeta`. Pueden salir varias, una por ficha visible.
4. No abras la pestaña Red para explicar esta barra. El Profiler mira el render.

**Validación**

- En el commit se lee `App`.
- En el commit se lee `Tarjeta`.
- La página sigue usable: borra la `n` y vuelven a leerse las seis fichas con la caja vacía.

### Fase 4 — Sin la extensión

**Objetivo.** Saber qué ficha se ejecutó al teclear, con `console.count`, cuando no hay Profiler.

Si ya completaste la fase 3, esta fase no sustituye esa lectura. Síguela solo si no tienes la extensión. El contador no da tiempos. Dice qué id se llamó.

1. En la primera línea del cuerpo de `Tarjeta`, añade `console.count(item.id)` y guarda.
2. Recarga. F12, Consola.
3. Escribe una letra. Cada id visible sube un paso, o dos con StrictMode.
4. Borra la letra. Vuelven a subir los que siguen en pantalla.
5. Deja el `console.count` si el laboratorio de esta página te manda usarlo. Si vas a usar el Profiler en el laboratorio, bórralo al acabar esta fase.

**Validación**

- Sin extensión: los id visibles suben al teclear.
- Con extensión: la fase 3 ya tiene `App` y `Tarjeta`, y esta fase no te hace falta.
- No has editado la lista para cambiar la barra del Profiler.

→ `App` sale al teclear, porque el estado de la caja vive ahí. `Tarjeta` sale en las que se volvieron a ejecutar. Si `memo` y `useCallback` ya están porque no pegaste los archivos, una letra no tiene por qué ejecutar las fichas cuyo `item` no cambió.

## Comprueba tu entendimiento

**Qué no mira el Profiler**
No lista las peticiones HTTP.
→ Eso es Network. El Profiler mira el render de React.

## Reto

### 1 — El commit del título

Si tienes el efecto de la pestaña, márcalo con el Profiler grabando.
→ Hay un commit porque `pendientes` cambió. El título del documento no es un componente, pero el render que lo provocó sí sale.

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| No aparece la pestaña Profiler | La extensión no está en ese navegador | Instálala, o usa el `console.count` |
| La grabación sale vacía | No tecleaste durante la grabación | Graba, escribe una letra, para |
| Grabé en Performance y no veo `Tarjeta` | Esa pestaña es la del navegador | La pestaña Profiler lleva el logo de React, al lado de Components |
| El botón no dice «Hecho» | Pulsaste «Anotar E-103» o «Anotar E-105» | El botón cuyo texto es «Anotar E-101» |

## Laboratorio

La demostración grabó una letra. Aquí grabas un clic en una ficha.

### Objetivo

Ver en el Profiler el commit del clic que marca E-101. La pastilla de esa ficha pasa a `revisado`.

### Fase 1 — E-101 pendiente, Profiler a la vista

**Objetivo.** Dejar el botón «Anotar E-101» y la pestaña Profiler abierta antes de grabar.

Si E-101 ya dice «Hecho», el clic no cambia el objeto y el commit no es el de esta práctica. Recargar restaura `datos.ts`: E-101 vuelve a `pendiente`. La pestaña que vas a usar lleva el logo de React. Rendimiento (Performance) no lista `Tarjeta`.

1. Abre `http://localhost:5173`. Si el botón de «Informe de accesibilidad» no dice «Anotar E-101», recarga.
2. F12. Localiza Profiler, al lado de Components.
3. Si no ves el logo, salta a la fase 4. Las fases 2 y 3 son el Profiler.

**Validación**

- El botón dice «Anotar E-101». La pastilla dice `pendiente`.
- O tienes abierta la pestaña Profiler, o vas a la fase 4.

### Fase 2 — Grabar el clic

**Objetivo.** Registrar solo el clic en «Anotar E-101», con la página ya cargada.

El círculo de grabar no recarga. El otro control sí recarga y empezarías con el pintado inicial, sin el clic. E-103 y E-105 también dicen «Anotar». El botón de esta fase es el que incluye el texto `E-101`.

1. En Profiler, pulsa el círculo de grabar.
2. En la página, pulsa «Anotar E-101».
3. El botón pasa a «Hecho E-101». La pastilla dice `revisado`. Desaparece «Falta revisión» en esa ficha.
4. Vuelve a las herramientas y pulsa el mismo círculo para parar.

**Validación**

- Hay al menos una barra de commit.
- En la página, el botón dice «Hecho E-101».
- La pastilla de esa ficha dice `revisado`.

### Fase 3 — Leer el commit del clic

**Objetivo.** Encontrar `App` o `Tarjeta` en la barra de ese clic.

Pulsa la última barra si hay varias: es el clic. El gráfico lista componentes por nombre.

Con `memo` y `useCallback` todavía en `App`, la `Tarjeta` coloreada es la de E-101. Las otras pueden salir grises: en ese commit no se ejecutaron. Si esta página empezó pegando `App` y `Tarjeta` sin `memo`, pueden salir varias `Tarjeta` coloreadas. También vale: el commit es el del clic. No hace falta que las seis fichas hayan recibido otro `item`.

La pestaña Red no entra en la comprobación. El clic no pide el documento.

1. Pulsa la barra del clic.
2. Localiza `App`.
3. Localiza `Tarjeta`.
4. No cambies código para hacer la barra más alta.

**Validación**

- En el gráfico se lee `App` o `Tarjeta`.
- E-101 sigue en `revisado` al mirar la página.
- No has abierto Red para decidir si el clic cuenta.

### Fase 4 — Sin la extensión

**Objetivo.** Ver, con `console.count`, que el clic en E-101 ejecuta al menos esa ficha.

Sigue esta fase solo si no hay Profiler. El número de `console.count` no vuelve a cero al limpiar la consola. Recargar sí lo reinicia, y el primer pintado ya cuenta.

1. En la primera línea del cuerpo de `Tarjeta`, añade `console.count(item.id)` y guarda.
2. Recarga. Confirma que el botón vuelve a decir «Anotar E-101».
3. F12, Consola. Anota el número de `E-101` y el de `E-104`.
4. Pulsa «Anotar E-101».
5. `E-101` sube. Si no hay `memo`, `E-104` también sube. La pastilla de E-101 dice `revisado`.
6. Borra el `console.count` al acabar. La página de Lighthouse lo quiere fuera.

**Validación**

- `E-101` ha subido tras el clic.
- El botón dice «Hecho E-101».
- `Tarjeta.tsx` ya no contiene `console.count` cuando terminas el paso 6.

→ La grabación tiene el commit del clic. E-101 cambia a `revisado`. No hace falta que las seis fichas hayan recibido otro `item`.
