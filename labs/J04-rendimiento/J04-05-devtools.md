# J04-05 — Chrome DevTools

[← Página anterior](J04-04-lazy.md) · [Siguiente página →](J04-06-profiler.md)

Network dice si cada letra pide el documento o el JSON. Performance dice si el tiempo se fue en script, en pintura o en red. En seis fichas el tramo es corto. La pregunta se hace igual.

## Demostración

### Objetivo

Leer Network y una pasada corta de Performance mientras se filtra, sin cambiar código para «mejorar» lo que salga.

### Fase 1 — La bandeja en el 5173

**Objetivo.** Tener la lista servida por Vite, para que la pestaña Red hable de esta página y no de un archivo abierto en disco.

`npm run dev` dentro de `bandeja/` deja el puerto 5173. Estos dos archivos importan `datos.ts`. Con ellos no hay petición a `entregables.json`. Si tu `App` sí pide el JSON, la fase 3 te dice qué fila mirar.

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

3. Abre `http://localhost:5173`. Si el puerto no responde, `npm run dev` en `bandeja/`.

**Validación**

- La barra de direcciones es `localhost:5173`, no un archivo `file://`.
- Hay seis fichas y la caja «Buscar».
- `App.tsx` importa `datos.ts`.

### Fase 2 — El documento, una vez

**Objetivo.** Localizar la fila del HTML y ver que una letra no la repite.

Vite carga muchos módulos `.js` y `.tsx`. Esos no son el documento. El filtro `Doc` deja solo el HTML. El tipo de esa fila es `document`. El nombre suele ser `localhost` o `/`.

1. F12, pestaña Red. Pulsa el icono de prohibido para vaciar la lista.
2. En la barra de filtros pulsa `Doc`, no `All` y no `JS`.
3. Recarga con F5.
4. Anota cuántas filas hay. Tiene que quedar una, con estado 200.
5. Sin vaciar la lista y sin quitar `Doc`, haz clic en «Buscar» y escribe `Norte`.
6. La página se queda en E-101 y E-103. En Red sigue una fila `document`.

**Validación**

- Tras recargar, con `Doc`, hay una fila.
- `Norte` no añade una segunda fila `document`.
- La bandeja ha filtrado.

### Fase 3 — El JSON, si tu app lo pide

**Objetivo.** Mirar si `entregables.json` sale al recargar y si se repite al teclear.

Con el `App` de la fase 1 la lista nace de `datos.ts`. Esa petición no existe. Si tu archivo pide `/entregables.json`, la fila sale una vez al cargar y no vuelve con la letra.

1. Quita el filtro `Doc` y pulsa `Fetch/XHR`.
2. Recarga.
3. Busca una fila `entregables.json`.
4. Si está, escribe `Norte` sin vaciar la lista. La fila no se repite.
5. Si la lista sale vacía, no busques el JSON: esta página no lo pide. Vacía la caja «Buscar» al terminar.

**Validación**

- Has mirado el filtro `Fetch/XHR` después de recargar.
- O no hay fila `entregables.json`, o hay una y `Norte` no añade otra.

### Fase 4 — Un tramo corto de Performance

**Objetivo.** Grabar el filtro y ver que hay algo de script, sin cambiar código.

La pestaña se llama Rendimiento o Performance. Es la del navegador, no el Profiler de React. Grabas, escribes `Norte`, borras y paras. En seis fichas el tramo es corto. La lectura es esa.

1. Abre Rendimiento (Performance).
2. Pulsa el círculo de grabar. No recargues: la grabación es el tecleo, con la página ya abierta.
3. Haz clic en «Buscar». Escribe `Norte`. Borra la caja.
4. Para la grabación con el mismo control.
5. En la línea de tiempo, mira si aparece un tramo de script al teclear. No edites `App` ni `Tarjeta` para acortarlo.

**Validación**

- La grabación no está vacía: hay actividad en el intervalo en que escribiste.
- Has visto el tramo, corto, de esa pasada.
- `Norte` sigue filtrando si lo escribes otra vez, y la caja vacía devuelve las seis fichas.

→ El documento se pide al recargar, no al teclear. En seis fichas el tramo de Performance es corto. La lectura es esa, no una optimización.

## Comprueba tu entendimiento

**Qué pregunta contesta Network**
No contesta cuántas veces se ejecutó `Tarjeta`.
→ Contesta qué salió por la red. El contador de la consola contesta lo otro.

## Reto

### 1 — El JSON a mano

Abre `http://localhost:5173/entregables.json` desde la barra de direcciones.
→ El archivo está publicado. Que la app lo pida o no depende de si `App` todavía importa `datos.ts`.

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Cada letra pide el HTML | No estás en el puerto de Vite | `npm run dev`, puerto 5173 |
| Performance vacío | La grabación no estaba en marcha al teclear | Graba, teclea, para |
| Al teclear aparecen muchas filas | Estás contando los `.js` de Vite | En la barra de Red pulsa el filtro `Doc` y cuenta solo esa fila |
| No encuentro Slow 3G | El desplegable trae otros nombres | La opción más lenta que no sea Offline: `3G` o `Slow 4G` |

## Laboratorio

La demostración miró la Red al teclear, sin limitar. Aquí miras la Red al recargar con la CPU y la red limitadas.

### Objetivo

Ver el documento y, si existe, `entregables.json`, con la red en «Slow 3G». Teclear sigue sin repetirlos.

### Fase 1 — Limitar red y CPU

**Objetivo.** Dejar la página más lenta a propósito, para que la fila del documento se distinga al recargar.

La red se limita en la pestaña Red. La CPU se limita en Rendimiento, en el engranaje. Las dos siguen mientras las herramientas estén abiertas. `npm run dev` sigue en `bandeja/` y la página es `http://localhost:5173`.

1. F12, pestaña Red.
2. En la barra hay un desplegable que dice `No throttling` o `Sin limitación`. Ábrelo y elige `Slow 3G`. Si no está, elige la opción más lenta que no sea `Offline` (`3G` o `Slow 4G`).
3. Ve a Rendimiento (Performance). Pulsa el engranaje, «Capture settings». En CPU elige `4x slowdown`. Si ese nombre no está, cualquier slowdown que no sea `No throttling`.
4. En esa pestaña queda un icono de aviso: la CPU sigue limitada. Vuelve a Red.

**Validación**

- El desplegable de Red no dice `No throttling`.
- El icono de aviso de la CPU está visible en Rendimiento.
- La bandeja sigue abierta en el 5173.

### Fase 2 — Una sola fila, más despacio

**Objetivo.** Contar el documento al recargar, con el filtro `Doc`, y ver que la carga tarda más que en la demostración.

Las filas `.js` y `.tsx` no entran. Si las ves, `Doc` no está pulsado.

1. En Red, pulsa el icono de prohibido para vaciar la lista.
2. Pulsa el filtro `Doc`.
3. Recarga con F5 y espera. Con Slow 3G la barra tarda más que antes.
4. Anota el número de filas.

**Validación**

- Hay una fila.
- El tipo es `document`. El nombre es la dirección de la página, a menudo `localhost` o `/`. El estado es 200.
- Has esperado a que esa fila terminara, más despacio que sin la limitación.

### Fase 3 — Norte no pide otro HTML

**Objetivo.** Escribir `Norte` con la limitación puesta y ver que el documento no se repite.

El filtro y la lista de Red se quedan como los dejó la fase 2. Vaciar la lista ahora te haría perder la fila que estás comparando.

1. Sin vaciar la lista y sin quitar `Doc`, haz clic en «Buscar».
2. Escribe `Norte`.
3. Cuenta otra vez las filas `document`.

**Validación**

- En la página quedan E-101 y E-103.
- En Red sigue habiendo una fila `document`.

### Fase 4 — El JSON con la red lenta

**Objetivo.** Repetir la lectura de `Fetch/XHR` con la limitación todavía puesta.

El `App` de la demostración importa `datos.ts`. En ese caso la lista sale vacía y no hay fila que esperar. Si tu `App` carga el JSON, la fila ya salió en la recarga de la fase 2 y no se repite al teclear.

1. Quita el filtro `Doc` y pulsa `Fetch/XHR`.
2. Si la lista está vacía, anota que no hay `entregables.json`.
3. Si la fila existe, escribe `Norte` otra vez sin vaciar la lista. No aparece una segunda.

**Validación**

- Has mirado `Fetch/XHR` con la red todavía limitada.
- O no hay JSON, o hay una fila y el tecleo no la duplica.

### Fase 5 — Quitar las limitaciones

**Objetivo.** Devolver la red y la CPU al estado de siempre, y comprobar que la bandeja responde como al empezar.

Si te las dejas, la página siguiente también irá lenta y parecerán un fallo de la app.

1. En Red, el desplegable vuelve a `No throttling`.
2. En Rendimiento, el engranaje, CPU vuelve a `No throttling`. El icono de aviso desaparece.
3. Recarga una vez.
4. Vacía «Buscar». Escribe `Norte` y bórralo.

**Validación**

- Red y CPU dicen `No throttling`.
- La recarga ya no espera como en Slow 3G.
- La caja vacía muestra las seis fichas.

→ El documento se pide una vez, más despacio. `Norte` no añade otra fila del HTML. Si la lista viene de `entregables.json`, esa fila tampoco se repite al teclear.
