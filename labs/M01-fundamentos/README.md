# M01 — Fundamentos

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


[← Página anterior](../../README.md) · [Siguiente página →](01-entorno.md)

> [!NOTE]
> Esta es la guía del módulo. Se lee página a página. Al final de cada página hay un laboratorio, por si toca practicar ese concepto. El laboratorio no sustituye a la página.

## Qué aprenderás

- Arrancar la bandeja con Vite y dejar un paquete con `build`.
- Leer TSX: interfaz, expresión y `className`.
- Pasar datos con props, reaccionar a un clic y componer con `children`.

## De qué va

La bandeja es la aplicación de la semana: una lista de entregables de proveedor que se revisa en el navegador. El documento se descarga una vez. Cuando más adelante el filtro o una pastilla cambien, React vuelve a pintar ese trozo. No hay una petición nueva de toda la página.

Hoy el recorrido es el cimiento: el entorno que la sirve, el fichero que la describe y las tres formas de componer una ficha —props, evento y children—.

## Páginas

1. [Entorno, Vite y build](01-entorno.md)
2. [TSX](02-tsx.md)
3. [Props](03-props.md)
4. [Eventos](04-eventos.md)
5. [Children](05-children.md)

## Demostración guiada

Punto de partida: `bandeja/src/App.tsx` pinta el título «Bandeja de entregables» y el párrafo «Revisión de lo que entrega el proveedor.» No hay ficha, no hay `Tarjeta.tsx` y no hay `modelo.ts`.

Cada página de abajo deja la bandeja en un sitio concreto. La siguiente parte de ese sitio.

1. [Entorno](01-entorno.md). Terminal en `bandeja/`, `npm run dev`, puerto 5173, el título en el navegador. `npm run build` termina y aparece `dist/`. La página no cambia.
2. [TSX](02-tsx.md). Nace `bandeja/src/modelo.ts` y, en el paso 4, `bandeja/src/componentes/Tarjeta.tsx`. El navegador pasa del párrafo fijo a «Informe de accesibilidad» y a una pastilla `pendiente`.
3. [Props](03-props.md). El objeto sale de `Tarjeta` y entra por `item`. Al final hay seis fichas, de E-101 a E-106, leídas de `bandeja/src/datos.ts`.
4. [Eventos](04-eventos.md). La consola está vacía al cargar. «Anotar E-104» escribe `E-104` una vez. La pastilla no se mueve.
5. [Children](05-children.md). La lista queda dentro de `Marco`. El encabezado «Lista» y las fichas viajan por sitios distintos.

→ Sigue en **[Entorno, Vite y build](01-entorno.md)**.
