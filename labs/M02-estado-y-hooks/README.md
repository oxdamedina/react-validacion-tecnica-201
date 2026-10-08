# M02 — Estado, hooks y flujo de datos

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


[← Página anterior](../M01-fundamentos/05-children.md) · [Siguiente página →](01-estado.md)

> [!NOTE]
> Guía del módulo. Los laboratorios quedan al final de cada página, para practicar el concepto. La lectura sigue por aquí.

## Qué aprenderás

- Guardar un dato que, al cambiar, vuelve a pintar.
- Calcular lo que se ve, sin guardarlo otra vez.
- Dejar el estado en el padre y avisar desde la ficha.
- Sincronizar el título de la pestaña después de pintar.

## De qué va

Hasta aquí la lista es un array importado y el botón solo escribe en la consola. A partir de ahora la caja de búsqueda y la pastilla viven en memoria de React. La ficha sigue sin decidir si un entregable está revisado: avisa, y el padre cambia la lista.

## Páginas

1. [Estado y valor derivado](01-estado.md)
2. [Flujo de datos](02-flujo.md)
3. [useEffect y las reglas](03-efecto.md)

La práctica de estas tres páginas es la carpeta `labs/M03-estado-y-flujo/`. El número de esa carpeta es el de sus laboratorios. El módulo 2 del curso es este.

## Demostración guiada

Punto de partida, el final de [eventos](../M01-fundamentos/04-eventos.md): seis fichas de `bandeja/src/datos.ts`, de E-101 a E-106. El botón escribe el id en la consola. No hay caja de búsqueda. La pastilla no cambia al pulsar. `Tarjeta` está en `bandeja/src/componentes/Tarjeta.tsx` y solo conoce `item`.

1. [Estado](01-estado.md). Aparece la caja «Buscar». `Este` deja solo «Inventario de componentes». `zzzz` deja la frase «Ningún entregable coincide.» y el array de `datos.ts` sigue con seis objetos. Un `let` en la caja no acumula letras.
2. [Flujo](02-flujo.md). «Anotar E-101» pasa esa pastilla a `revisado`, quita «Falta revisión» y el botón dice «Hecho». E-103 sigue pendiente. Recargar devuelve E-101 a pendiente.
3. [Efecto](03-efecto.md). La pestaña del navegador dice «Pendientes: 3». Filtrar no baja ese número. Marcar un pendiente, sí. Un hook debajo de un `if` rompe la pantalla a la tercera letra.

→ Sigue en **[Estado y valor derivado](01-estado.md)**.
