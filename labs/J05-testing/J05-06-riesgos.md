# J05-06 — Riesgos

[← Página anterior](J05-05-checklist.md) · [Siguiente página →](../../README.md)

Un riesgo es un fallo que el caso no cubre y que puede volver. Quitar `toLowerCase` rompe el caso de `Este`. Un botón que siempre dice «Anotar» no lo rompe, porque ese caso no mira la pastilla.

## Demostración

### Objetivo

Romper el filtro, ver el caso rojo, arreglarlo sin borrar el caso, y nombrar un fallo que el caso no ve.

### Código de partida

El filtro usa `texto.toLowerCase()`. El botón dice «Hecho» cuando `item.estado === "revisado"`.

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

`bandeja/cypress/e2e/bandeja.cy.js`

```js
describe("bandeja", () => {
  it("muestra el título", () => {
    cy.visit("/")
    cy.contains("h1", "Bandeja de entregables")
  })

  it("filtra por Este", () => {
    cy.visit("/")
    cy.get("#filtro").type("Este")
    cy.contains("Inventario de componentes")
    cy.contains("Informe de accesibilidad").should("not.exist")
  })
})
```

`npm run dev` parado antes de `npm run test:e2e`.

### 1 — El fallo que el caso ve

**Dónde:** el `filter` de `visibles`.

**Qué haces:**

1. Quita `.toLowerCase()` de `texto` y déjalo en `blob.includes(texto)`.
2. `npm run test:e2e`.
3. Devuelve `texto.toLowerCase()`.
4. Relanza. Deja el `it` en el archivo.

**Experimento:** borra el `it` del filtro, deja el filtro roto y lanza el script. Restaura el `it` y el `toLowerCase()`.

→ Sin `toLowerCase()`, el caso de `Este` falla. Al devolverlo, pasa. Sin el `it`, el script pasa aunque el filtro esté roto. El caso se queda.

### 2 — El fallo que el caso no ve

**Dónde:** el texto del botón en `Tarjeta.tsx`.

**Qué haces:**

1. Deja el botón siempre en `{textoBoton} {item.id}`, sin el ternario de «Hecho».
2. Lanza `npm run test:e2e` si no añadiste el caso de la pastilla.
3. Restaura el ternario.

```tsx
{item.estado === "revisado" ? "Hecho" : textoBoton} {item.id}
```

**Experimento:** con el botón siempre en «Anotar», marca E-101 en el navegador.

→ La pastilla puede cambiar y el botón miente, o al revés si también tocaste la pastilla. El caso de `Este` pasa. Ese es el riesgo: el recorrido automático no mira el rótulo. Si añadiste el caso de `.estado` en J05-03, ese sí falla cuando la pastilla no cambia. Restaura el ternario.

**Validación:**

- `npm run test:e2e` pasa con el filtro arreglado y el caso presente.
- El botón vuelve a decir «Hecho» cuando el estado es `revisado`.
- No queda `blob.includes(texto)` sin `toLowerCase()`.

## Comprueba tu entendimiento

**Qué riesgo te llevas**
Un caso borrado al corregir, y un fallo fuera del texto que el caso busca.
→ El `it` se queda. El checklist cubre lo que el `it` no ejecuta.

## Reto

### 1 — El caso de la pastilla, si no está

Añade este caso, deja el botón siempre en «Anotar» y lanza el script. El caso falla. Restaura el ternario del botón y el caso pasa.

```js
it("marca el informe", () => {
  cy.visit("/")
  cy.contains("article", "Informe de accesibilidad").within(() => {
    cy.contains("button", "Anotar").click()
    cy.get(".estado").should("have.text", "revisado")
  })
})
```

<details>
<summary>Ver solución</summary>

Si el caso lee `.estado` y la pastilla sí cambia, pasa aunque el botón diga «Anotar». Para cazar el rótulo hace falta un `contains` de «Hecho». Restaura el ternario. El caso puede quedarse.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Sigue rojo | El `toLowerCase` no volvió, o `dev` ocupa el puerto | Restaura la línea y relanza con el puerto libre |
| El caso pasa con el filtro roto | El `it` escribe `este` en minúsculas | El caso escribe `Este` |
| Borraste el caso | Salió con el experimento | Vuelve a pegar el `it` de J05-03 |

## Laboratorio

La demostración quitó `toLowerCase` y dejó el botón siempre en «Anotar». Aquí rompes una frase que ningún caso mira.

### Objetivo

Cambiar el aviso de vacío y ver que `npm run test:e2e` sigue pasando si no hay un caso de `zzzz`.

### Código de partida

Los `it` del título y de `Este`. El de `zzzz`, si lo añadiste en el laboratorio de Cypress, quítalo un momento para este ejercicio y déjalo aparte. El párrafo vacío dice «Ningún entregable coincide.».

### Qué haces

1. En `App`, esa frase pasa a «No hay resultados».
2. `npm run test:e2e`.
3. En el navegador, `zzzz` muestra la frase nueva.
4. Restaura «Ningún entregable coincide.». Si tenías el caso de `zzzz`, vuelve a pegarlo.

→ El script pasa. La pantalla, con `zzzz`, no dice lo que decía el entregable. El caso de `Este` no ha protegido esa frase. Por eso esa fila vive en el checklist aunque el script esté verde.
