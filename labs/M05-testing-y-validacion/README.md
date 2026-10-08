# M05 — Testing y validación

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


[← Página anterior](../M04-rendimiento/01-que-mirar.md) · [Siguiente página →](01-recorrido.md)

> [!NOTE]
> Guía del cierre. Un recorrido automático y un checklist. No convierten el curso en un curso de testing: comprueban la bandeja que ya está leída.

## Qué aprenderás

- Leer un caso de Cypress como lo que ve una persona, no como el estado interno.
- Separar un test que afirma la pastilla de uno que solo afirma el botón.
- Recorrer un checklist reutilizable en otra entrega.

## De qué va

El caso que ya viene en el repositorio visita `/` y busca el título. Sirve para saber que Vite arrancó. No mira el filtro ni la pastilla. El cierre de la semana añade el recorrido que sí importa y deja por escrito qué más se mira en una entrega aunque el test no lo cubra.

## Páginas

1. [El recorrido y el checklist](01-recorrido.md)

## Demostración guiada

Punto de partida: la caja `#filtro` y las seis fichas. La lista puede salir de `datos.ts` o del JSON. Se para `npm run dev`. [M05-01](M05-01-caso.md) añade el caso que escribe `Este`. [M05-02](M05-02-correccion.md) rompe el `toLowerCase`, ve el caso rojo y lo arregla sin borrar el caso. El guion está en [el recorrido](01-recorrido.md).

→ Sigue en **[El recorrido y el checklist](01-recorrido.md)**.
