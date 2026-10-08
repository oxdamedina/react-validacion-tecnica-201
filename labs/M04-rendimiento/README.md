# M04 — Rendimiento

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


[← Página anterior](../M03-apis-y-arquitectura/02-estructura.md) · [Siguiente página →](01-que-mirar.md)

> [!NOTE]
> Guía del módulo. Aquí se aprende qué mirar. Los laboratorios del final de la página siguiente sirven para comprobar una ficha, no para convertir el curso en un curso de rendimiento.

## Qué aprenderás

- Separar el render del commit, y no optimizar antes de ver el coste.
- Reconocer cuándo `memo` no se salta un pintado.
- Saber qué pregunta contestan el Profiler, Performance y Lighthouse.

## De qué va

La bandeja de seis fichas no está lenta. El módulo no existe para acelerarla. Existe para leer una entrega cuando alguien diga que «va mal»: qué componente se volvió a ejecutar, si el tiempo se fue en script o en red, y si un `memo` está puesto sin una medición.

## Páginas

1. [Qué mirar](01-que-mirar.md)

## Demostración guiada

Punto de partida: una bandeja que filtra y marca. El `fetch` puede estar o no. [M04-01](M04-01-medir.md) cuenta ejecuciones de `Tarjeta` al teclear y lee una pasada de Lighthouse, sin cambiar el comportamiento. [M04-02](M04-02-optimizar.md) estabiliza `marcar`, enseña un `useMemo` al que le falta `texto`, y quita el contador. El guion está en [Qué mirar](01-que-mirar.md).

→ Sigue en **[Qué mirar](01-que-mirar.md)**.
