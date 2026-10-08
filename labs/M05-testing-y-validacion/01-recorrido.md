# El recorrido y el checklist

[← Página anterior](README.md) · [Siguiente página →](../../README.md)

Un test de extremo a extremo abre la aplicación como la abre un navegador: visita una URL, escribe, pulsa y lee lo que quedó pintado. No importa `useState` ni el hook. Cypress ejecuta esos pasos. `cy.visit` carga la página. `cy.contains` busca texto visible. `cy.get` busca un selector. `within` limita la búsqueda a una ficha.

`npm run test:e2e` arranca Vite, espera el puerto 5173 y lanza Cypress sin ventana. Si `npm run dev` ya ocupa el puerto, el script no puede arrancar el suyo.

| Comprobación | Dónde encaja |
|--------------|----------------|
| ¿El filtro deja una ficha y esconde otra? | Cypress, contra el texto de la página |
| ¿Marcar cambia la pastilla? | Cypress, leyendo `.estado`, no el botón |
| ¿Una letra repinta fichas de más? | Contador o Profiler, no un test de texto |

> [!NOTE]
> Un test verde que afirma lo que ya está mal no valida la entrega. Si el botón pasa a «Hecho» y el test solo busca «Hecho», la pastilla puede seguir en `pendiente`. El aserto tiene que leer la pastilla.

El checklist, para esta bandeja y para otra entrega:

| Pregunta | Señal a favor |
|----------|----------------|
| ¿Se distinguen cargar, vacío y error? | Tres textos distintos, no una lista en blanco para todo |
| ¿La ficha solo pinta? | La petición está en `api/`. En `Tarjeta` no hay `fetch` |
| ¿El filtro dispara otra petición? | Network: una al entrar, ninguna al teclear |
| ¿El estado tiene forma? | Interfaces, sin `any`. Un estado que no existe no entra |
| ¿Hizo falta optimizar? | Hubo una medición. Un `memo` sin contador ni Profiler no cuenta |
| ¿Queda un recorrido automático? | Cypress visita, actúa y lee lo visible |
| ¿El control tiene nombre? | `<label htmlFor>` coincide con el `id` del input |

> [!WARNING]
> Corregir un fallo y borrar el caso deja la entrega como al principio: el siguiente cambio puede devolver el fallo sin que se vea. El caso se queda.

## Demostración guiada

Punto de partida: caja `#filtro` y seis fichas. Si no están, se pega el `App.tsx` de [M05-01](M05-01-caso.md). Se para `npm run dev`: Cypress arranca el suyo.

1. En `bandeja/cypress/e2e/bandeja.cy.js`, después del caso del título, un caso escribe `Este` en `#filtro`, ve «Inventario de componentes» y no ve «Informe de accesibilidad». `npm run test:e2e` en `bandeja/`. Pasan los dos.
2. El texto pasa a `zzzz`. El caso falla buscando el inventario. Cypress mira la página, no `useState`. Se restituye `Este`.
3. Se quita `.toLowerCase()` de `texto` en el filtro. El caso de `Este` se pone rojo. Se devuelve `toLowerCase()` y se deja el `it` en el archivo. Vuelve a pasar.
4. Con `dev` otra vez: `zzzz` muestra «Ningún entregable coincide.». Pulsar la etiqueta «Buscar» enfoca `#filtro`. Marcar E-101 deja la pastilla en `revisado`.

Dónde queda: el caso sigue en el archivo. Borrarlo al corregir el fallo deja la entrega como al principio.

## Práctica

[M05-01 — Un caso](M05-01-caso.md) y [M05-02 — Corregir lo que el caso ve](M05-02-correccion.md). El caso mira el texto de la página. Sirve con la lista en `datos.ts` o en el JSON.
