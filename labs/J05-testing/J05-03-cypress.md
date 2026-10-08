# J05-03 — Cypress

[← Página anterior](J05-02-vision.md) · [Siguiente página →](J05-07-componente.md)

El caso nuevo escribe en `#filtro`. El id del input tiene que ser `filtro`. El script se lanza con `npm run dev` parado, porque Cypress usa el puerto 5173.

## Demostración

### Objetivo

Añadir el caso que escribe `Este` y verlo fallar cuando el texto no está.

### Código de partida

El input tiene `id="filtro"`. `npm run dev` está parado.

`bandeja/cypress/e2e/bandeja.cy.js`

```js
describe("bandeja", () => {
  it("muestra el título", () => {
    cy.visit("/")
    cy.contains("h1", "Bandeja de entregables")
  })
})
```

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

### 1 — El caso del filtro

**Dónde:** dentro del `describe`, después del caso del título.

**Qué haces:**

1. Añade el `it`.
2. `npm run test:e2e` en `bandeja/`.
3. Cambia `"Este"` por `"zzzz"` y relanza.
4. Restaura `"Este"` y relanza.

```js
it("filtra por Este", () => {
  cy.visit("/")
  cy.get("#filtro").type("Este")
  cy.contains("Inventario de componentes")
  cy.contains("Informe de accesibilidad").should("not.exist")
})
```

**Experimento:** con `zzzz`, lee el mensaje de Cypress. Nombra el texto que no encontró, no una variable.

→ Pasan el título y el filtro con `Este`. Con `zzzz`, falla «Inventario de componentes». Al restaurar, los dos pasan.

**Validación:**

- El caso del título sigue.
- `#filtro` encuentra el input.
- El archivo se queda con `"Este"`.

## Comprueba tu entendimiento

**Qué no afirma**
El caso no pulsa «Anotar».
→ La pastilla puede estar mal y este `it` pasa. El reto lo cubre.

## Reto

### 1 — La pastilla

Añade un caso que, en el artículo de «Informe de accesibilidad», pulse el botón que contiene «Anotar» y lea `revisado` en `.estado`.

<details>
<summary>Ver solución</summary>

```js
it("marca el informe", () => {
  cy.visit("/")
  cy.contains("article", "Informe de accesibilidad").within(() => {
    cy.contains("button", "Anotar").click()
    cy.get(".estado").should("have.text", "revisado")
  })
})
```

Al cargar, el botón dice «Anotar E-101». Tras el clic, la pastilla es `revisado`.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| No encuentra `#filtro` | El `id` del input es otro | `id="filtro"` |
| Falla con el inventario | El filtro distingue mal las mayúsculas, o el caso sigue en `zzzz` | `texto.toLowerCase()` y el caso en `"Este"` |
| Puerto ocupado | `dev` en marcha | Páralo y relanza |

## Laboratorio

La demostración escribió `Este` y buscó el inventario. Aquí el caso es el vacío.

### Objetivo

`zzzz` muestra «Ningún entregable coincide.» y no muestra «Inventario de componentes».

### Código de partida

El `it` de `Este` está en `bandeja.cy.js`. `#filtro` existe. `npm run dev` parado.

### Qué haces

1. Añade este `it` después del de `Este`. No borres el de `Este`.
2. `npm run test:e2e`.
3. Cambia la frase esperada por «Lista vacía». Falla.
4. Restaura «Ningún entregable coincide.».

```js
it("avisa cuando nada coincide", () => {
  cy.visit("/")
  cy.get("#filtro").type("zzzz")
  cy.contains("Ningún entregable coincide.")
  cy.contains("Inventario de componentes").should("not.exist")
})
```

→ Pasan el título, `Este` y `zzzz`. Con la frase inventada, Cypress cita el texto que no está. El caso de `Este` no se ha tocado.
