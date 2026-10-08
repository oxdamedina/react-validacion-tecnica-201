# M03 — APIs y arquitectura

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


[← Página anterior](../M02-estado-y-hooks/03-efecto.md) · [Siguiente página →](01-peticion.md)

> [!NOTE]
> Guía del módulo. La práctica de cada idea está enlazada al final de la página.

## Qué aprenderás

- Sustituir el array importado por una petición y distinguir carga, error y vacío.
- Leer la respuesta como `unknown` hasta comprobar que es `Entregable[]`.
- Dejar la petición fuera de la ficha y reconocer un árbol revisable.

## De qué va

Hasta ahora la lista vive en el paquete. En una entrega real llega por HTTP. La pantalla pinta antes de que la respuesta exista, y quien revisa tiene que poder separar «está cargando», «falló» y «no hay coincidencias».

## Páginas

1. [La petición y los tres finales](01-peticion.md)
2. [Estructura](02-estructura.md)

## Demostración guiada

Cada página se cierra con su laboratorio. El laboratorio trae el archivo de partida: si la bandeja del alumno es otra, se pega ese archivo y se hace solo el paso nuevo.

1. [La petición](01-peticion.md) y [M03-01](M03-01-peticion.md). De `datos.ts` a `/entregables.json`. Carga, error y filtro vacío son tres frases.
2. [Estructura](02-estructura.md) y [M03-02](M03-02-estructura.md). La petición sale de `App` y entra en `useEntregables`. `App` se queda el filtro.

→ Sigue en **[La petición y los tres finales](01-peticion.md)**.
