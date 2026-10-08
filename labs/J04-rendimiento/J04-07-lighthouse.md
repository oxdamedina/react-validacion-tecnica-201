# J04-07 — Lighthouse

[← Página anterior](J04-06-profiler.md) · [Siguiente página →](../J05-testing/README.md)

Lighthouse hace una pasada de carga. En seis fichas la nota sale holgada. Esa nota no borra lo que decía el contador de la consola, y el contador no es la nota.

## Demostración

### Objetivo

Leer una pasada de carga en escritorio y quitar el contador de depuración.

### Fase 1 — La página que va a medir

**Objetivo.** Dejar la bandeja en el 5173, con las seis fichas, antes de lanzar Lighthouse.

Lighthouse recarga la dirección que esté abierta. Tiene que ser `http://localhost:5173`, con `npm run dev` en `bandeja/`. Estos dos archivos no llevan `console.count`. Si `Tarjeta` todavía lo tiene de otra página, la fase 3 lo quita. No lo quites antes de leer la nota si quieres comparar: la fase 2 mide la carga, y el contador no entra en esa nota.

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

2. Sustituye `bandeja/src/componentes/Tarjeta.tsx` por este archivo y guarda. Si quieres conservar un `console.count` para la comparación de la fase 3, no pegues este archivo y deja el que ya cuenta. Si lo pegas, el contador ya no está y la fase 3 solo comprueba que sigue fuera.

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

3. Recarga `http://localhost:5173`.

**Validación**

- Hay seis fichas y la caja «Buscar».
- El puerto responde.
- Sabes si `Tarjeta.tsx` contiene `console.count` o no. Lo usarás en la fase 3.

### Fase 2 — Una pasada de escritorio

**Objetivo.** Leer un número de la categoría Rendimiento, sin editar código para subirlo.

Lighthouse viene con el navegador. F12, pestaña Lighthouse. Si no está en la barra, pulsa `>>` y elígela. El modo es Navigation. El dispositivo de esta fase es Desktop (Escritorio). Marca solo Rendimiento (Performance): la pasada es más corta y el número que lees es el de esa categoría.

«Analyze page load» recarga sola la página. No pulses la bandeja mientras el círculo no haya aparecido. El número grande, de 0 a 100, es la puntuación. También puedes leer el peso o el bloqueo, el que tengas a la vista. Anótalo como escritorio. El laboratorio lo pone al lado del de móvil. Una segunda pasada puede variar unos puntos: te quedas con el que ha salido.

1. Abre Lighthouse.
2. Modo Navigation. Dispositivo Desktop. Categoría Rendimiento. El resto sin marcar.
3. Pulsa «Analyze page load». Espera al círculo.
4. Anota la puntuación, o el peso, o el bloqueo. Una cifra basta.
5. No cambies `Tarjeta`, el filtro ni `memo` para subirla.

**Validación**

- Tienes un número de escritorio apuntado.
- La pasada ha terminado: se ve el informe, no una barra a medias.
- No has editado componentes en esta fase.

### Fase 3 — El contador fuera

**Objetivo.** Dejar `Tarjeta` sin `console.count` y comprobar que una letra ya no escribe ids.

La nota de la fase 2 mira la carga. El contador, si estuvo, miraba renders. Son lecturas distintas. `memo` y `useCallback` pueden quedarse si otra página los dejó y no pegaste el `Tarjeta` de la fase 1. El `console.count` no se queda.

1. Abre `bandeja/src/componentes/Tarjeta.tsx`.
2. Si hay `console.count`, borra esa línea. Guarda. Si no hay ninguna, el archivo ya está listo.
3. Busca en el proyecto otra línea `console.count` por si la dejaste en `App.tsx`. Bórrala también.
4. Recarga. F12, Consola. Limpia la pantalla. Escribe una letra en «Buscar».
5. La consola no escribe `E-101` ni `App`.

**Validación**

- Has leído al menos un número de Lighthouse.
- `Tarjeta.tsx` no contiene `console.count`.
- Una letra no escribe ids en la consola.
- El filtro y marcar siguen igual: `Norte` deja dos fichas, y «Anotar E-101» pasa esa ficha a `revisado` si todavía estaba pendiente. Recarga si Lighthouse te dejó la caja en otro estado.

→ En seis fichas la pasada sale holgada. El contador, mientras estuvo, decía que había ejecuciones de más. Son lecturas distintas. `memo` y `useCallback` pueden quedarse. El `console.count` no.

## Comprueba tu entendimiento

**Qué no demuestra la nota**
Una nota alta no dice que `memo` hiciera falta.
→ La nota mira la carga. El contador miraba los renders. En esta lista la nota no justifica el `memo`. El contador explicó por qué se puso.

## Reto

### 1 — Lighthouse no ve el estado

Marca E-101 y lanza otra pasada. Lighthouse recarga la página.
→ La marca no está en el informe. La pasada vuelve a cargar `/` y el estado de memoria se pierde.

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Lighthouse no abre la app | El puerto no responde | `npm run dev` en `bandeja/` |
| La consola sigue contando | Quedó otro `console.count` | Búscalo en `Tarjeta.tsx` y bórralo |
| No veo la pestaña Lighthouse | Está en el menú de pestañas escondidas | F12, el botón `>>`, y elige Lighthouse |
| La pasada falla al momento | Otra extensión bloquea la página | Cierra el aviso del informe y lanza otra vez, con la bandeja en el 5173 |

## Laboratorio

La demostración lanzó Lighthouse en escritorio y no persiguió la nota. Aquí cambias el dispositivo, no el código.

### Objetivo

Sacar una segunda pasada con móvil y quedarte con las dos notas, sin editar `Tarjeta`.

### Fase 1 — El número de escritorio, si te falta

**Objetivo.** Tener apuntada la cifra de escritorio antes de cambiar el dispositivo.

Si la demostración ya te la dejó en un papel, anótala al margen y pasa a la fase 2. Esta fase repite la pasada de escritorio solo cuando esa cifra no existe. `Tarjeta.tsx` no lleva `console.count`. Si queda, bórralo y guarda antes de medir: la pasada no es el sitio para depurar renders.

1. Confirma que `npm run dev` responde en `http://localhost:5173`.
2. Busca `console.count` en `Tarjeta.tsx`. Si está, bórralo y guarda.
3. Si ya tienes el número de escritorio, sigue a la fase 2.
4. Si no lo tienes: F12, Lighthouse, modo Navigation, dispositivo Desktop, solo Rendimiento. «Analyze page load». Espera al círculo. No pulses la bandeja durante la pasada.
5. Anota el número grande, de 0 a 100, como escritorio.

**Validación**

- Tienes una cifra llamada escritorio.
- `Tarjeta.tsx` no contiene `console.count`.
- No has cambiado componentes para subir la cifra.

### Fase 2 — La pasada de móvil

**Objetivo.** Sacar el número de móvil con la misma categoría, sin tocar el código.

El dispositivo pasa a Mobile (Móvil). El resto del panel se queda: Navigation, solo Rendimiento. Lighthouse recarga otra vez. El estado de la bandeja (una marca, un filtro) se pierde porque vuelve a cargar `/`.

1. En el mismo panel, dispositivo Mobile.
2. Categoría Rendimiento marcada. El resto sin marcar.
3. «Analyze page load». Espera al círculo.
4. Anota el número grande como móvil, al lado del de escritorio.

**Validación**

- Tienes dos números, con el dispositivo escrito al lado de cada uno.
- La segunda pasada es la de móvil.
- `Tarjeta.tsx` sigue sin `console.count` y sin otros cambios de esta fase.

### Fase 3 — Apuntarlos y quitar el apunte del código

**Objetivo.** Conservar las dos cifras fuera de los componentes, y dejar `App.tsx` como estaba.

El papel basta. Si las escribes en código, es un comentario de un momento en la primera línea de `App.tsx`, y se borra antes de seguir. Esas cifras del ejemplo no son las tuyas.

1. Copia tus dos números a un papel, o pon este comentario con tus cifras y guárdalo solo para leerlo.

```tsx
// Lighthouse: escritorio 90, móvil 80
```

2. No cambies `Tarjeta`, el filtro ni `memo` para acercar un número al otro.
3. Borra el comentario si lo pusiste. `App.tsx` vuelve a empezar en el `import`.
4. Recarga. Escribe `Norte`: quedan E-101 y E-103. Vacía la caja.
5. Pulsa «Anotar E-101». La pastilla pasa a `revisado` y el botón dice «Hecho E-101».

**Validación**

- Sigues teniendo las dos cifras, en papel o en la cabeza, no dentro de un archivo.
- El comentario ya no está en `App.tsx`.
- El filtro y el botón responden.
- `Tarjeta.tsx` no se ha editado en este laboratorio para subir la nota.

→ Hay dos números. Ninguno ha obligado a tocar `memo` ni el filtro. La bandeja se usa igual.
