# Qué mirar

[← Página anterior](README.md) · [Siguiente página →](../M05-testing-y-validacion/README.md)

React pinta en dos momentos. **Render**: llama a las funciones y calcula el árbol. **Commit**: aplica ese árbol al documento. Una función lenta dentro del componente alarga el render.

Si el estado vive en el padre, un `setTexto` vuelve a ejecutar al padre. Cada hijo se vuelve a ejecutar también, salvo que una comparación de props lo evite. `memo` se salta el render si las props son iguales por comparación superficial.

Esa comparación se rompe con facilidad:

| Prop que parece igual | Por qué `memo` no se la salta |
|-----------------------|-------------------------------|
| `estilo={{ padding: 4 }}` | Objeto nuevo en cada render del padre |
| `alMarcar={() => ...}` | Función nueva en cada render del padre |
| El valor de un contexto creado como `{ revisor }` dentro del componente | Objeto nuevo, y el contexto despierta a quien lo lee |
| `item={item}` del mismo array | Esta sí se puede saltar: es la misma referencia |

`useCallback` y `useMemo` fijan la referencia de una función o de un valor. No aceleran nada por sí solos. Sirven cuando un hijo memorizado, o un contexto, compara esa referencia. Olvidar `texto` en el `useMemo` del filtro hace que la caja cambie y las fichas no.

`lazy` parte el paquete: un panel que no hace falta en la primera pintura llega cuando se muestra, y `Suspense` enseña un respaldo mientras llega. En la bandeja de seis fichas no hay un panel así. La idea basta para reconocerla en una entrega.

Tres herramientas, tres preguntas:

| Herramienta | Pregunta |
|-------------|----------|
| React Profiler, de la extensión React DevTools | Qué componente se ejecutó y cuánto tardó el render |
| Performance, en las herramientas del navegador | Si el tiempo se fue en script, en pintura o en red |
| Lighthouse | Una pasada de carga: peso, bloqueo y otras reglas |

> [!NOTE]
> El Profiler no está en el navegador a secas. Hace falta [React DevTools](https://react.dev/learn/react-developer-tools) en el Chrome donde se abre el puerto. Lighthouse y Performance vienen con el navegador.

> [!WARNING]
> Poner `memo` en las seis fichas no demuestra que hiciera falta. Primero se cuenta o se graba. Si el contador de una ficha sube al teclear en el buscador, la prop o el contexto están naciendo de nuevo. Si no sube, `memo` ya se la salta y no hay nada que celebrar en una lista corta.

## Demostración guiada

Punto de partida: una bandeja que filtra y marca. Si `App.tsx` no es esa, se pega el código de partida de [M04-01](M04-01-medir.md). El `fetch` no hace falta para este recorrido.

1. `console.count(item.id)` en la primera línea de `Tarjeta`. Una letra en «Buscar» hace subir el contador de las fichas que siguen. `marcar`, creado en el cuerpo de `App`, es otra función en ese pintado.
2. Lighthouse, una pasada de rendimiento. En seis fichas la nota sale holgada. El contador decía otra cosa: hay ejecuciones de más, y no se ven en esa nota.
3. `memo(Tarjeta)` sin tocar `marcar`: el contador sigue. `useCallback` alrededor de `marcar`, con `[]`, y la letra deja de contar en las fichas cuyo `item` no cambió. Marcar E-101 cuenta esa ficha, porque su objeto es nuevo.
4. `useMemo` del filtro con `[items, texto]`. Se deja solo `[items]`: la caja escribe y las fichas no se mueven. Se restituye `texto`.
5. Se borra `console.count`.

Dónde queda: el filtro y marcar se ven igual. El caso de Cypress, en el módulo siguiente, mira el texto de la página, no este contador.

## Práctica

[M04-01 — Medir](M04-01-medir.md) y [M04-02 — Una optimización](M04-02-optimizar.md). Cada uno trae su punto de partida. No pasan por otra carpeta.
