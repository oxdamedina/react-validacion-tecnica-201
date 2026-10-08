# J02-04 — Ciclo de vida

[← Página anterior](J02-03-useeffect.md) · [Siguiente página →](J02-05-flujo.md)

Montar es el primer pintado. Actualizar es cada pintado siguiente. Desmontar es cuando el componente deja de estar. La función que devuelve el efecto es la limpieza: React la llama antes de repetir el efecto y al desmontar. Los hooks van al principio de la función, siempre en el mismo orden, nunca debajo de un `return` condicional.

## Demostración

### Objetivo

Ver la limpieza del efecto y el fallo de un hook que no se llama siempre.

### Código de partida

Al recargar, la pestaña del navegador dice «Pendientes: 3». El `<h1>` no lleva ese número. Pega `App.tsx` si el tuyo no tiene este efecto. `Tarjeta` es la de abajo.

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

### 1 — Limpieza y un hook de más

**Dónde:** el efecto del título, y luego justo antes del `return`.

**Qué haces:**

1. Haz que el efecto devuelva una limpieza.
2. Marca un pendiente con la consola abierta.
3. Quita la limpieza si quieres dejar solo el título, o déjala.
4. Añade el `if` de abajo, escribe `E`, `Es`, `Est`, y luego bórralo.

```tsx
useEffect(() => {
  document.title = `Pendientes: ${pendientes}`
  return () => {
    document.title = "Bandeja de entregables"
    console.log("limpieza")
  }
}, [pendientes])
```

```tsx
if (texto.length > 2) {
  return <p>Demasiado texto {extra}</p>
}

const [extra, setExtra] = useState(0)
```

`setExtra` puede quedar sin usar. Es parte del experimento.

**Experimento:** con una y dos letras la bandeja sigue. Con la tercera, la consola habla de hooks o Problems marca el hook después del `return`.

→ Al marcar, sale `limpieza` y enseguida «Pendientes: N». Tras borrar el `if` y `extra`, el filtro responde y la pestaña vuelve a «Pendientes: 3» al recargar.

**Validación:**

- No queda `extra`.
- No hay un `useState` dentro del `map`.
- Los hooks están antes del `return`.

## Comprueba tu entendimiento

**Dónde están**
Recorre `App` y cuenta las llamadas que empiezan por `use`.
→ Todas están antes del `return`. Ninguna está dentro de un `if`.

## Reto

### 1 — El aviso sin romper la página

Declara `useState` dentro de `if (false)`. Lee Problems. Borra la línea.

<details>
<summary>Ver solución</summary>

El editor marca la regla aunque `false` nunca entre. Los hooks no van en una rama.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| La página sigue rota | El `if (texto.length > 2)` sigue | Bórralo y recarga |
| El filtro no vuelve | Borraste `texto` | `useState("")` sigue al principio |

## Laboratorio

La demostración limpió el efecto del título y rompió el orden de los hooks. Aquí el efecto es un reloj que se desmonta.

### Objetivo

Parar un `setInterval` cuando el reloj deja de pintarse.

### Código de partida

Los hooks de `App` están antes del `return`. El efecto del título puede quedarse.

### Qué haces

1. Crea `bandeja/src/componentes/Reloj.tsx` con este archivo.
2. En `App`, un estado `ver` y un botón que lo invierte. Si `ver`, pintas `<Reloj />`.
3. Abre la consola. Muestra el reloj, espera un segundo, ocúltalo.
4. Borra `Reloj` y el botón si no lo quieres dejar. La limpieza tiene que estar: sin el `return` del efecto, el intervalo seguiría tras ocultarlo.

```tsx
import { useEffect, useState } from "react"

export default function Reloj() {
  const [segundos, setSegundos] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSegundos((n) => n + 1), 1000)
    return () => {
      clearInterval(id)
      console.log("reloj parado")
    }
  }, [])

  return <p>Reloj: {segundos}</p>
}
```

```tsx
const [ver, setVer] = useState(false)
```

```tsx
<button type="button" onClick={() => setVer((activo) => !activo)}>
  {ver ? "Ocultar reloj" : "Ver reloj"}
</button>
{ver ? <Reloj /> : null}
```

→ Al ocultar, la consola escribe «reloj parado» y el número no sigue creciendo en un componente que ya no está.
