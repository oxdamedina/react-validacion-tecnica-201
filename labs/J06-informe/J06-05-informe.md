# J06-05 — El informe

[← Página anterior](J06-04-lighthouse.md) · [Índice del curso →](../../README.md)

El informe es lo que el autor puede repetir sin haber estado delante. Cada frase lleva la herramienta, el gesto y el dato que salió. No lleva un parche ni un «habría que poner `memo`».

Se escribe fuera de `bandeja/src`. Medido con `npm run dev` en `http://127.0.0.1:5173`.

**Red.** Escribe cuántas filas `document` quedan con el filtro **Documento** al recargar, y si escribir `Norte` añade otra. Escribe si **Fetch/XHR** quedó vacío o pidió el JSON. En estas capturas: una fila al recargar, la misma al escribir `Norte`, y Fetch/XHR vacío. Para qué: decir si filtrar vuelve a bajar la página. El estado 200 o 304 solo dice si el navegador ya tenía el HTML.

**Rendimiento.** Escribe, al grabar con el círculo mientras escribes y borras `Norte`, si el resumen muestra secuencias de comandos y si la fila de la página marca una descarga. En esta captura hay tiempo de script y la fila de `127.0.0.1` marca 0 kB. Para qué: decir si el gesto costó código, y que el nombre aún no es el del componente.

**React DevTools.** Escribe las props de una `Tarjeta` tal como salieron (`item` con su id, y `alMarcar`). Escribe los componentes del commit de una letra y los del commit de «Anotar E-101», y que la pastilla pasó a `revisado`. Copia las barras en color y, si las hay, las rayadas. En estas capturas la letra ejecutó `App` y dejó las `Tarjeta` rayadas; el clic ejecutó `App` y la `Tarjeta` de E-101. Para qué: decir qué se ejecutó. Esta parte exige el entorno de desarrollo. Con solo la página publicada el Profiler no graba y el clic no se atribuye a un componente.

**Lighthouse.** Escribe la puntuación de Rendimiento en Ordenador y en Móvil, de esta URL, etiquetada como dev. En la pasada de Ordenador de estas capturas salió 42. La tuya puede ser otra: se anota la que salió, sin pedir que suba. Para qué: describir la carga. Una pasada sobre una URL publicada sería otro número, con los mismos clics, y no se mezcla con estos.

Al final, una línea basta para el otro acceso: Red, Rendimiento y Lighthouse se pueden usar igual en la página publicada; el Profiler, no.
