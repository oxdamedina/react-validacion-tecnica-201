# J05-07 — Test de componente

[← Página anterior](J05-03-cypress.md) · [Siguiente página →](J05-04-entregable.md)

Cypress tiene dos modos en el mismo `cypress.config.js`.

El e2e abre la bandeja. `npm run test:e2e` arranca Vite en el 5173 y `cy.visit("/")` carga `App`: caja, seis fichas y el estado. El caso lee lo que quedó pintado.

El de componente no abre esa URL y no usa el puerto 5173. Cypress arranca otro Vite, el del bloque `component`. Sirve una página en blanco: `cypress/support/component-index.html`, un documento con un solo `div` marcado `data-cy-root`. `cy.mount` pinta ahí el componente que le pases, con las props del caso. En esta demo es solo `Tarjeta`. No hay `App`, ni «Buscar», ni las otras cinco fichas, ni `datos.ts`.

El clic no cambia la pastilla. `Tarjeta` no guarda el estado: llama a `alMarcar(id)` y sigue mostrando lo que recibió. El caso comprueba esa llamada con un doble (`cy.stub`), no un `setItems` que aquí no existe.

`supportFile: false` del e2e se queda. Si el e2e cargara `cypress/support/component.ts`, intentaría registrar `mount` en un recorrido que solo visita páginas. Cada modo tiene su soporte.

## Demostración

### Objetivo

Dejar el modo componente listo y ver un caso que monta `Tarjeta` pendiente, sin levantar la bandeja.

### Fase 1 — El bloque que arranca Vite para un componente

**Objetivo.** Decirle a Cypress que el modo componente usa React y el Vite de `bandeja/`, y que los casos viven en `cypress/component/`.

El e2e sigue con `baseUrl` en el 5173. El bloque nuevo no tiene `baseUrl`: no hay servidor de la app que visitar. `devServer` reutiliza `vite.config.ts` (el plugin de React y el JSX). `specPattern` limita la búsqueda a esa carpeta, así `npm run test:e2e` no mezcla estos archivos. El script de e2e lleva `--e2e` por la misma razón.

1. Abre `bandeja/cypress.config.js`. Tiene que quedar así. Si el bloque `component` ya está, no lo dupliques.

```js
import { defineConfig } from "cypress"

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://127.0.0.1:5173",
    supportFile: false,
    video: false,
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
    indexHtmlFile: "cypress/support/component-index.html",
    video: false,
  },
})
```

2. En `bandeja/package.json`, el script de e2e llama a `cypress run --e2e`. A su lado, el de componente no arranca la bandeja:

```json
"test:e2e": "start-server-and-test dev http://127.0.0.1:5173 \"cypress run --e2e\"",
"test:component": "cypress run --component"
```

**Validación**

- `cypress.config.js` tiene `e2e` y `component`.
- `e2e.supportFile` es `false`.
- `component.devServer` dice `framework: "react"` y `bundler: "vite"`.
- `package.json` tiene `test:component`.

### Fase 2 — La página en blanco y el comando mount

**Objetivo.** Tener el documento donde se pinta la ficha, y registrar `cy.mount` para los casos.

`component-index.html` es la página entera del modo componente. Cypress vacía y rellena el `div` de `data-cy-root` en cada `mount`. No enlaza `estilos.css` de la bandeja: el caso lee texto y el botón, no la clase visual.

`cypress/support/component.ts` importa `mount` de `cypress/react` (viene con el paquete `cypress`, no hay otro que instalar) y lo publica como `cy.mount`. El `declare global` es para que el editor conozca el comando en los `.tsx`. `cypress/tsconfig.json` incluye esos archivos y no entra en `npm run build`: el build sigue mirando solo `src`.

1. Crea `bandeja/cypress/support/component-index.html` si no está.

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tests de componente</title>
  </head>
  <body>
    <div data-cy-root></div>
  </body>
</html>
```

2. Crea `bandeja/cypress/support/component.ts`.

```ts
import { mount } from "cypress/react"

Cypress.Commands.add("mount", mount)

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}
```

3. Crea `bandeja/cypress/tsconfig.json`.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "types": ["cypress"],
    "skipLibCheck": true,
    "noEmit": true,
    "isolatedModules": true
  },
  "include": ["./**/*.ts", "./**/*.tsx"]
}
```

**Validación**

- El HTML tiene un `div` con `data-cy-root` y no tiene la lista de fichas.
- `component.ts` importa `mount` desde `cypress/react`.
- `tsconfig.app.json` sigue con `"include": ["src"]`. El de Cypress es otro archivo.

### Fase 3 — Montar la ficha pendiente

**Objetivo.** Escribir un caso que pinte `Tarjeta` con un entregable inventado y compruebe el clic.

El objeto no sale de `datos.ts`. Lo escribe el caso. `alMarcar` es `cy.stub().as("marcar")`: una función que anota con qué argumentos la llamaron. Después del clic, el botón sigue diciendo «Anotar E-101». La pastilla sigue en `pendiente`. Eso es lo esperado: no hay padre que haga `setItems`. Lo que tiene que cumplirse es `have.been.calledWith` con `"E-101"`.

1. Crea `bandeja/cypress/component/Tarjeta.cy.tsx`.

```tsx
import Tarjeta from "../../src/componentes/Tarjeta"
import type { Entregable } from "../../src/modelo"

const pendiente: Entregable = {
  id: "E-101",
  titulo: "Informe de accesibilidad",
  proveedor: "Norte",
  estado: "pendiente",
}

describe("Tarjeta", () => {
  it("pinta el pendiente y avisa al marcar", () => {
    cy.mount(
      <Tarjeta item={pendiente} alMarcar={cy.stub().as("marcar")} />,
    )
    cy.contains("Informe de accesibilidad")
    cy.contains("Falta revisión")
    cy.contains("button", "Anotar E-101").click()
    cy.get("@marcar").should("have.been.calledWith", "E-101")
  })
})
```

2. No arranques `npm run dev`. Este modo no lo usa.
3. En `bandeja/`, lanza `npm run test:component`.
4. La salida nombra `Tarjeta.cy.tsx` y un caso en verde. El navegador es el de Cypress, sin ventana.

**Validación**

- El comando termina con el caso en verde.
- La terminal no dice que el puerto 5173 esté ocupado: no ha intentado abrir la bandeja.
- `bandeja.cy.js` no se ha ejecutado en esta pasada. Sigue siendo el e2e.

→ `cy.mount` pinta una ficha. `cy.visit` pinta la bandeja. El doble sustituye al padre.

## Comprueba tu entendimiento

**Qué no carga este modo**
No hay caja «Buscar» en `component-index.html`.
→ El caso no puede escribir `Norte`. Para el filtro hace falta el e2e, que abre `App`.

## Reto

### 1 — Un id que el botón no envía

En el `should`, espera `"E-999"` en vez de `"E-101"`. Lanza `npm run test:component`. Restaura `"E-101"`.

<details>
<summary>Ver solución</summary>

El caso falla: el doble recibió `"E-101"`. La ficha sigue leyéndose. Al restituir el id, vuelve a verde.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| `cy.mount is not a function` | El caso no carga el soporte | `supportFile` del bloque `component` apunta a `cypress/support/component.ts` |
| No encuentra specs | El archivo no está bajo `cypress/component/` o no acaba en `.cy.tsx` | `Tarjeta.cy.tsx` en esa carpeta |
| Intenta usar el puerto 5173 | Lanzaste `test:e2e` | `npm run test:component`, con `dev` parado o en marcha: este script no lo mira |
| El botón no pasa a «Hecho» tras el clic | El caso espera un `setState` que `Tarjeta` no tiene | Comprueba el doble, no el texto del botón |

## Laboratorio

La demostración montó una ficha `pendiente` y comprobó la llamada. Aquí montas la misma ficha ya `revisado`, sin borrar el caso anterior.

### Objetivo

Un segundo `it` que lee «Hecho E-101» y no lee «Falta revisión», porque el estado llega por la prop.

### Fase 1 — Otra prop, otro texto

**Objetivo.** Ver que el rótulo sale del `estado` que escribe el caso, no de un clic previo.

`Tarjeta` elige «Hecho» cuando `item.estado` es `"revisado"`, y solo entonces omite «Falta revisión». Este caso no necesita el doble: no hay clic que comprobar. El primero, el de `pendiente`, se queda en el mismo `describe`.

1. En `bandeja/cypress/component/Tarjeta.cy.tsx`, debajo de `pendiente`, añade el objeto y el `it`. No borres el caso que ya pasa.

```tsx
const revisado: Entregable = {
  id: "E-101",
  titulo: "Informe de accesibilidad",
  proveedor: "Norte",
  estado: "revisado",
}

it("pinta el revisado sin el aviso", () => {
  cy.mount(<Tarjeta item={revisado} alMarcar={() => undefined} />)
  cy.contains("button", "Hecho E-101")
  cy.contains("Falta revisión").should("not.exist")
})
```

2. `alMarcar` es obligatorio en las props. La flecha vacía cumple el tipo. No hace falta `.as("marcar")` porque este caso no pulsa.
3. Guarda. `npm run test:component` otra vez. Sigue sin hacer falta `npm run dev`.

**Validación**

- La salida muestra dos casos en verde, los dos dentro de `Tarjeta`.
- «Hecho E-101» está en el caso nuevo.
- El caso de `pendiente` sigue en el archivo y sigue pasando.

→ El mismo componente, otra prop. La página en blanco no ha cambiado. El e2e tampoco.
