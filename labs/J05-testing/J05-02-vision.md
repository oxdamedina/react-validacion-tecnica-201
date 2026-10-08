# J05-02 — Testing en React

[← Página anterior](J05-01-estrategia.md) · [Siguiente página →](J05-03-cypress.md)

Cypress, en el caso de esta página, abre la aplicación. No monta el componente en un test de unidad y no lee `texto` ni `items`. Si el filtro compara mal las mayúsculas, el caso lo ve porque el título no está en la página. Montar solo una ficha es el [test de componente](J05-07-componente.md).

## Demostración

### Objetivo

Lanzar el caso del título y comprobar que no lee el estado de React.

### Código de partida

`npm run dev` parado. El puerto 5173 libre. Terminal en `bandeja/`.

El caso que va a ejecutarse es este:

```js
describe("bandeja", () => {
  it("muestra el título", () => {
    cy.visit("/")
    cy.contains("h1", "Bandeja de entregables")
  })
})
```

La bandeja que Cypress abre es la de la caja y las fichas:

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

### 1 — El script

**Dónde:** la terminal, en `bandeja/`.

**Qué haces:**

1. Para `dev` con Ctrl+C si sigue abierto.
2. `npm run test:e2e`.
3. Lee el resumen. El caso del título pasa.
4. Abre `bandeja.cy.js` y busca `useState`. No está.

**Experimento:** cambia el texto que busca el caso a `Bandeja que no existe`. Relanza. Restaura `Bandeja de entregables`.

→ Con el texto falso, el caso falla porque la página no lo muestra. No falla por un estado interno. Al restaurar, pasa.

**Validación:**

- El comando es `npm run test:e2e` dentro de `bandeja/`.
- El caso del título pasa con el texto real.
- No has dejado el texto falso.

## Comprueba tu entendimiento

**Qué abre Cypress**
No importa `Tarjeta` en el test.
→ Abre la URL `/` en un navegador que arranca el propio script.

## Reto

### 1 — El puerto ocupado

Lanza `npm run dev` y, sin pararlo, `npm run test:e2e` en otra terminal.
→ El script no puede usar el 5173. Para `dev` y relanza el test.

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Puerto en uso | `dev` sigue | Ctrl+C y otra vez `test:e2e` |
| Falla el título | El `<h1>` no dice «Bandeja de entregables» | Restaura el texto en `App.tsx` |

## Laboratorio

La demostración ejecutó el caso del título sin importar `App`. Aquí el caso mira un botón de la página, no una variable.

### Objetivo

Afirmar que el primer botón contiene «E-101». Sin `import` de `App` ni de `datos`.

### Código de partida

`npm run dev` parado. `bandeja.cy.js` tiene el caso del título.

### Qué haces

1. Añade este `it`.
2. `npm run test:e2e`.
3. Cambia `"E-101"` por `"E-999"`. Falla porque el botón no está en la página.
4. Restaura `"E-101"`.

```js
it("muestra el botón del informe", () => {
  cy.visit("/")
  cy.contains("button", "E-101")
})
```

→ Pasa con E-101. Falla con E-999 y Cypress habla del texto que no encontró. El archivo no importa `entregables`.
