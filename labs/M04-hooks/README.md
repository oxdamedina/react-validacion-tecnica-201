# Práctica — Hooks sueltos

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


> Esta carpeta no es el recorrido. El módulo 4 es [rendimiento](../M04-rendimiento/README.md), y sus laboratorios están en esa carpeta. La petición y la estructura están en [M03](../M03-apis-y-arquitectura/README.md). Lo de aquí queda como material aparte: no hace falta abrirlo para seguir el curso.

[← Página anterior](../M01-fundamentos/05-children.md) · [Siguiente página →](M04-01-children.md)

> [!NOTE]
> Cada laboratorio añade un hook o una prop de React. El anterior sigue en el archivo.

## Qué aprenderás

- `children`, un fragmento, `useRef`, un contexto, `useMemo`, `useReducer` y un hook propio.
- A comprobar una sola cosa en cada uno: el foco, el nombre del revisor, el filtro que se congela, la pastilla que cambia vía `dispatch`.

## Teoría

Un hook es una función cuyo nombre empieza por `use` y que solo se llama en el tope del componente o de otro hook. El hook propio de este módulo es el sitio donde acabará la lista. Hasta entonces, la lista sigue en `App` para que veas el cambio de sitio.

## Demostración guiada

El guion de cada idea está en la página de la guía. Aquí, el corte de cada laboratorio.

Punto de partida: el final de M03-05. Buscador, seis fichas, pastilla que cambia, pestaña «Pendientes: 3». Lista en `datos.ts`.

1. [M04-01](M04-01-children.md). Se crea `bandeja/src/componentes/Marco.tsx`. La `<ul>` queda entre `<Marco titulo="Lista">` y `</Marco>`. Encima de las fichas se lee «Lista». Cerrar la etiqueta sin hijos deja el encabezado y vacía la lista.
2. [M04-02](M04-02-fragmento.md). El `<section>` del marco pasa a un fragmento. El encabezado sigue. En el inspector, el padre del `<h2>` es `<main>`. Dos elementos sueltos en el `return` no compilan.
3. [M04-03](M04-03-useref.md). `useRef` en `#filtro`. El botón «Ir al buscador» enfoca la caja. Después se escribe `Este` sin volver a pincharla y queda el inventario.
4. [M04-04](M04-04-contexto.md). Caja `#revisor`, valor inicial «Ana». `Tarjeta` lee el nombre con `useContext` y pinta «Revisor: Ana». Escribir `Luis` lo pone en todas. `TarjetaProps` no gana un campo `revisor`.
5. [M04-05](M04-05-usememo.md). El filtro va en `useMemo` con `[items, texto]`. Dejar solo `[items]` hace que la caja escriba y las fichas no se muevan. Se restituye `texto`.
6. [M04-06](M04-06-usereducer.md). `marcar` pasa a `dispatch({ type: "marcar", id })`. Un clic sigue tocando una sola ficha.
7. [M04-07](M04-07-hook-propio.md). Nace `bandeja/src/hooks/useEntregables.ts`. `App` se queda el filtro. En `App.tsx` no queda `useReducer`. La lista sigue en `datos.ts`.

Dónde queda: el hook existe. [M05-01](../M05-datos/M05-01-fetch.md) sustituye `datos.ts` por `/entregables.json`.

## Ahora practica tú

| Lab | Título | Qué harás |
|-----|--------|-----------|
| M04-01 | [children](M04-01-children.md) | Envolver la lista |
| M04-02 | [El fragmento](M04-02-fragmento.md) | Quitar el envoltorio de más |
| M04-03 | [useRef](M04-03-useref.md) | Llevar el foco al buscador |
| M04-04 | [El contexto](M04-04-contexto.md) | El nombre del revisor, sin pasarlo por props |
| M04-05 | [useMemo](M04-05-usememo.md) | El filtro y sus dependencias |
| M04-06 | [useReducer](M04-06-usereducer.md) | `marcar` como acción |
| M04-07 | [El hook propio](M04-07-hook-propio.md) | Sacar la lista de `App` |

→ Empieza por **[M04-01 — children](M04-01-children.md)**.
