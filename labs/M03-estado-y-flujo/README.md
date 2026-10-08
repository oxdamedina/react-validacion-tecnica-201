# Práctica — Estado y flujo

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


> Práctica del módulo 2: [estado](../M02-estado-y-hooks/01-estado.md), [flujo](../M02-estado-y-hooks/02-flujo.md) y [efecto](../M02-estado-y-hooks/03-efecto.md). La carpeta se llama M03. El módulo 3 del curso es [APIs](../M03-apis-y-arquitectura/README.md).

[← Página anterior](../M02-estado-y-hooks/01-estado.md) · [Siguiente página →](M03-01-usestate.md)

> [!NOTE]
> El array deja de ser una constante pintada tal cual. El estado vive en el padre. La tarjeta avisa.

## Qué aprenderás

- Guardar el texto del buscador con `useState`.
- Calcular la lista visible, sin un segundo estado.
- Subir el clic al padre y sincronizar el título de la pestaña.

## Teoría

Una variable normal no vuelve a pintar. `useState` sí. Lo que se puede calcular a partir del estado no se guarda otra vez.

El hijo no modifica la lista. Llama a una función que el padre le pasó, tipada como `(id: string) => void`.

## Demostración guiada

El guion está en las tres páginas del [módulo de estado](../M02-estado-y-hooks/README.md). Los laboratorios lo cortan así.

Punto de partida: seis fichas desde `datos.ts`. El botón escribe el id en la consola. No hay input. `Tarjeta` está en `bandeja/src/componentes/Tarjeta.tsx`.

1. [M03-01](M03-01-usestate.md). Caja «Buscar», `id="filtro"`, atada a `useState("")`. Escribir `Este` no quita fichas todavía. Sustituir el estado por un `let` deja la caja sin acumular letras. Se restaura `useState`.
2. [M03-02](M03-02-derivado.md). `visibles` filtra título, proveedor e id. `Este` deja «Inventario de componentes». `zzzz` muestra «Ningún entregable coincide.» `datos.ts` sigue con seis objetos.
3. [M03-03](M03-03-flujo.md). `items` nace de `useState(entregables)`. «Anotar E-101» pasa esa pastilla a `revisado`, quita «Falta revisión» y el botón dice «Hecho E-101». E-103 sigue pendiente. Recargar devuelve E-101 a pendiente. Sin `item.id === id`, un clic marca las seis.
4. [M03-04](M03-04-useeffect.md). La pestaña dice «Pendientes: 3». `Sur` deja dos fichas y la pestaña sigue en 3. Marcar E-101 la baja a 2. Con `[]` en el efecto, se queda en 3. Se restituye `[pendientes]`.
5. [M03-05](M03-05-reglas.md). Un `useState` después de `if (texto.length > 2) return …` aguanta `E` y `Es`, y falla en `Est`. Se borra el `if`. Los hooks quedan antes del `return`.

Dónde queda: buscador, pastilla que cambia, pestaña «Pendientes: 3». La lista sigue en `datos.ts`.

## Ahora practica tú

| Lab | Título | Qué harás |
|-----|--------|-----------|
| M03-01 | [useState](M03-01-usestate.md) | Una caja controlada |
| M03-02 | [El derivado](M03-02-derivado.md) | Filtrar sin otro `useState` |
| M03-03 | [El flujo](M03-03-flujo.md) | El padre cambia `estado` |
| M03-04 | [useEffect](M03-04-useeffect.md) | El título de la pestaña |
| M03-05 | [Las reglas](M03-05-reglas.md) | Ver el error de un hook condicional y quitarlo |

→ Empieza por **[M03-01 — useState](M03-01-usestate.md)**.
