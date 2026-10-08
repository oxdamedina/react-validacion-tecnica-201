# Estructura

[← Página anterior](01-peticion.md) · [Siguiente página →](../M04-rendimiento/README.md)

La ficha pinta. No pide datos. La petición y el estado de la lista pueden salir de `App` sin cambiar lo que se ve. El filtro se queda en la pantalla, porque es de esta vista.

| Carpeta | Responsabilidad |
|---------|-----------------|
| `src/api/` | Hablar con HTTP. No pinta. |
| `src/hooks/` | Guardar carga, error y datos. No conoce el CSS. |
| `src/componentes/` | Pintar props y `children`. No llama a `fetch`. |
| `src/App.tsx` | Componer. El texto del buscador y `visibles` viven aquí. |

Un hook propio es una función cuyo nombre empieza por `use`. Cumple las mismas reglas: sus hooks van al principio, no dentro de un `if`. `useEntregables` devuelve `items`, `cargando`, `error` y `marcar`. `App` no necesita el `dispatch`.

Si la lista crece en acciones (`marcar`, `cargar`), un `useReducer` deja esos cambios en un solo `switch`. Cada acción es un tipo. `{ type: "borrar" }` no compila si no está en el tipo `Accion`. El reductor no sustituye a la carpeta: es la forma del estado dentro del hook.

Antipatrones que invalidan la lectura de una entrega:

- `fetch` suelto en el cuerpo del componente, fuera de un efecto.
- Una ficha que importa la API y además decide el filtro.
- `visibles` guardado en un `useState` además de calcularlo.

> [!WARNING]
> Derivar `visibles` con `useEffect` y `setVisibles` añade un pintado de retraso y un sitio más donde el filtro puede mentir. Se calcula en el render.

## Demostración guiada

Punto de partida: el final de [M03-01](M03-01-peticion.md). La petición, la carga, el error y el título de la pestaña están en `App.tsx`. Si ese archivo no está así, se pega el código de partida de [M03-02](M03-02-estructura.md).

1. Se crea `bandeja/src/hooks/useEntregables.ts` y se mudan ahí `items`, `cargando`, `error`, los dos efectos y `marcar`. Devuelve esos cuatro.
2. `App` se queda `texto`, `visibles` y los tres `return`. Recargar sigue mostrando las seis fichas, el filtro y «Pendientes: 3».
3. Un `fetch` escrito en el cuerpo de `Tarjeta` dispara una petición por ficha y otra por cada letra. Se borra. En `Tarjeta.tsx` no queda `fetch`. En `App.tsx` no queda `useEffect`.

Dónde queda: el hook pide el JSON. `App` solo filtra y compone.

## Práctica

[M03-02 — La estructura](M03-02-estructura.md). El laboratorio trae el `App.tsx` de después de la petición, por si ese paso no está en tu archivo.
