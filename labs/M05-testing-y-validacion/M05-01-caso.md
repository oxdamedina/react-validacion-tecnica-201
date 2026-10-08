# M05-01 — Un caso

[← Página anterior](README.md) · [Siguiente página →](M05-02-correccion.md)

> Práctica de [El recorrido y el checklist](01-recorrido.md).

### Objetivo

Añadir un caso de Cypress que deje solo el entregable del proveedor Este, y leer el fallo cuando el texto no está.

### Código de partida

La página tiene que mostrar las seis fichas y una caja con `id="filtro"`. Da igual si la lista sale de `datos.ts` o de `/entregables.json`. Si no hay caja, sustituye `App.tsx` por el código de partida de [M03-01](../M03-apis-y-arquitectura/M03-01-peticion.md), el de antes de la petición, y `Tarjeta.tsx` por el de [M03-04](../M03-estado-y-flujo/M03-04-useeffect.md).

Para el puerto: para `npm run dev` con Ctrl+C antes de lanzar el script. El script arranca el suyo.

El caso que ya está en `bandeja/cypress/e2e/bandeja.cy.js` visita `/` y busca el título. No mira el filtro.

### En qué consiste

Un `it` que escribe en la página. El experimento cambia el texto buscado, ve el caso rojo y lo restaura.

### 1 — El caso del filtro

**Dónde:** `bandeja/cypress/e2e/bandeja.cy.js`, dentro del `describe`, después del caso del título.

**Qué haces:**

1. Añade el caso.
2. En una terminal, entra en `bandeja/`.
3. Confirma que no hay un `npm run dev` usando el puerto 5173.
4. Lanza `npm run test:e2e` y espera a que termine.

```js
it("filtra por Este", () => {
  cy.visit("/")
  cy.get("#filtro").type("Este")
  cy.contains("Inventario de componentes")
  cy.contains("Informe de accesibilidad").should("not.exist")
})
```

**Experimento:** cambia `"Este"` por `"zzzz"`. Vuelve a lanzar el script.

→ El caso falla buscando «Inventario de componentes». Cypress no mira `useState`. Mira el texto de la página. Restaura `"Este"`. El caso pasa, junto al del título.

**Validación:**

- Los dos casos pasan.
- `#filtro` es el id del input. Si el caso no encuentra el elemento, el id del input no es `filtro`.
- No has borrado el caso del título.

## Comprueba tu entendimiento

**Qué no afirma el caso**
El caso no comprueba que el botón diga «Anotar» ni que la pastilla cambie.
→ Solo afirma que, con `Este` escrito, un título está y el otro no.

## Reto

### 1 — La pastilla

Añade un caso que, en el artículo de «Informe de accesibilidad», pulse el botón que contiene «Anotar» y lea `revisado` en `.estado`. Lanza otra vez el script.

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

Al cargar, el botón dice «Anotar E-101». Tras el clic, la pastilla es `revisado`. Si el caso solo comprueba que el botón existe, pasa aunque la pastilla no cambie.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| El puerto está ocupado | `npm run dev` sigue en marcha | Páralo con Ctrl+C y relanza `test:e2e` |
| No encuentra `#filtro` | El input no tiene ese id | `id="filtro"` en el código de partida |
| Falla con `zzzz` | El experimento sigue en el archivo | El texto del caso vuelve a `"Este"` |
