# Práctica — TSX y el componente

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


> Práctica de [TSX](../M01-fundamentos/02-tsx.md), en el módulo 1. El número M01-0N es el del laboratorio. La guía no pasa por esta carpeta: se abre al terminar de ver la página.

[← Página anterior](../M01-fundamentos/02-tsx.md) · [Siguiente página →](M01-01-entorno.md)

> [!NOTE]
> Este módulo se sigue laboratorio a laboratorio. La teoría de cada idea está en el propio laboratorio, en el momento de añadirla.

## Qué aprenderás

- Abrir el proyecto Vite que ya está en `bandeja/`.
- Describir un entregable con una interfaz, sin `any`.
- Pintar ese dato desde un componente funcional.

## Teoría

Un componente funcional es una función que devuelve interfaz. El fichero es `.tsx`: TypeScript más etiquetas. La interfaz dice qué campos tiene un dato. Si el objeto no encaja, el editor lo marca antes de llegar al navegador.

| Pieza | Dónde |
|-------|--------|
| Vite | Sirve `bandeja/` en el puerto 5173 |
| `interface` | El contrato del dato |
| Componente | Función con `export default` |

> [!NOTE]
> No hay componentes de clase en este curso. Si ves `class extends Component` en otro material, aquí no se usa.

## Demostración guiada

El guion, archivo por archivo, está en [TSX](../M01-fundamentos/02-tsx.md). Aquí el mismo recorrido, en el orden de los laboratorios.

Punto de partida: `bandeja/src/App.tsx` con el título «Bandeja de entregables» y el párrafo «Revisión de lo que entrega el proveedor.» Vite en el puerto 5173.

1. [M01-01](M01-01-entorno.md). `npm run dev` deja ese título. `npm run build` escribe `dist/` y la página del 5173 no se sustituye por `dist/`.
2. [M01-02](M01-02-interfaz.md). Se crea `bandeja/src/modelo.ts` con `Entregable`. En `App.tsx`, el objeto E-101 («Informe de accesibilidad», Norte, `pendiente`) y el párrafo `{entrega.titulo}`. `estado: "listo"` lo marca Problems. Se restaura `"pendiente"`.
3. [M01-03](M01-03-componente.md). Ahí nace `bandeja/src/componentes/Tarjeta.tsx`. El objeto se muda a ese archivo. `App` queda en `<Tarjeta />`. La página sigue en «Informe de accesibilidad». El import desde `Tarjeta` es `../modelo`.
4. [M01-04](M01-04-expresiones.md). Bajo el título se lee `E-101 · Norte`. Sin las llaves se lee la palabra `entrega.id`.
5. [M01-05](M01-05-clase.md). `` className={`estado ${entrega.estado}`} ``. Beige en `pendiente`, verde en `revisado`, rosada en `rechazado`. Se deja `pendiente`. `class` en vez de `className` lo marca el editor.

Dónde queda: una ficha. El objeto vive dentro de `Tarjeta.tsx`. La práctica siguiente, props, abre ese archivo. Está en la carpeta `M02-props-lista-evento` y sigue siendo el módulo 1.

## Ahora practica tú

| Lab | Título | Qué harás |
|-----|--------|-----------|
| M01-01 | [Entorno](M01-01-entorno.md) | Ver el título en el puerto 5173 |
| M01-02 | [La interfaz](M01-02-interfaz.md) | Declarar `Entregable` y provocar un error de tipo |
| M01-03 | [El componente](M01-03-componente.md) | Mover el dato a `Tarjeta` |
| M01-04 | [Expresiones](M01-04-expresiones.md) | Pintar id y proveedor entre llaves |
| M01-05 | [La clase](M01-05-clase.md) | Colgar `className` del estado |

→ Empieza por **[M01-01 — Entorno](M01-01-entorno.md)**.
