# Flota — dos apps, el mismo tablero

Mil autobuses. Cada fila son doce componentes: código, línea, destino, parada, sentido, ocupación, semáforo, actualizado, velocidad, retraso, coche y servicio.

Un emisor imita un WebSocket. Arranca a **8 pulsos por segundo**. En el header, − y + recorren 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 y 100: esa cifra es la cadencia pedida. Al lado, «procesa» cuenta los pulsos que el emisor llega a entregar por segundo y «renders» cuenta los commits del header. Si «renders» es menor, varios pulsos han caído en el mismo render. Cada pulso toca **una fila**: cambia su semáforo y pone a 0 el contador de esa misma fila. El resto de la fila no cambia.

«Hace n segundos» es un contador de la propia celda: suma 1 cada segundo. El pulso de su fila lo pone a 0, a la vez que cambia el semáforo. El tic pinta las mil celdas «actualizado» en las dos apps. El pulso, no: en A repinta el árbol; en B, el semáforo y el contador de esa fila.

El fondo ámbar es un render de ese nodo. Sirve para verlo sin abrir el Profiler. En React DevTools, «Highlight updates when components render» marca lo mismo.

## Flota A — prop drill

`App` guarda los mil autobuses. Cada pulso hace `setState` ahí. La lista baja por props: `App` → `Lista` → `Fila` → las doce celdas. No hay `memo`. Header, menú, títulos y las doce mil celdas vuelven a ejecutarse.

http://127.0.0.1:5174/a.html

## Flota B — store y memo

El pulso escribe en un store externo y avisa solo a la celda de esa fila y esa columna (`useSyncExternalStore`). `Fila` y las celdas quietas van con `memo` y reciben el `id`, que no cambia. El texto del header vive en `Control`, al lado de la lista: se actualiza y no arrastra las filas. El menú no se entera del pulso.

Un contexto con la lista entera no valdría: cada celda que lo leyera se pintaría en cada pulso. El store avisa a una sola.

http://127.0.0.1:5174/b.html

## Arranque

```bash
cd flota
npm install
npm run dev
```

Abre las dos direcciones en pestañas distintas. Graba **una cada vez**: la otra, en pausa. Si las dos emiten a la vez, se reparten la CPU y la comparación se mezcla.

**Pausar emisión** para el emisor. Un clic en una fila la marca; otro clic en la misma la quita. La marca vive en la fila. Las capas del menú (Mapa, Flota, Incidencias, Turnos, Talleres) solo cambian el botón activo: no filtran la tabla.

Hay tres gestos distintos. Conviene grabarlos por separado, porque cada uno tiene su causa:

| Gesto | Qué lo provoca | Qué debe moverse |
| --- | --- | --- |
| Pulso | El emisor, a la cadencia del header | En A, el árbol. En B, el header y dos celdas de una fila |
| Tic | El reloj de «hace n segundos», cada segundo, con la emisión en pausa | En las dos, las mil celdas Actualizado |
| Clic | Una fila, o un botón del menú, o + / − | Solo el estado de ese control |

## Dónde está cada evidencia

Cada herramienta contesta una pregunta. El orden de abajo sigue ese orden: primero quién se ejecutó, después cuánto costó.

| Pregunta | Herramienta | Qué miras |
| --- | --- | --- |
| ¿Este nodo se volvió a ejecutar? | La propia página (ámbar) y el panel Elementos | La clase `marca-a` / `marca-b` y el atributo `data-renders` |
| ¿Cuántas celdas, de las mil? | Consola | Un recuento de `data-renders` por columna |
| ¿Qué componente, con qué props? | React DevTools → Components | Árbol, pastilla Memo, props, hooks |
| ¿Quién se ejecutó en este commit, y por qué? | React DevTools → Profiler | Barras del commit, gráfica de llamas, «Why did this render?» |
| ¿Cuánto tardó el hilo principal, la pintura, los frames? | Rendimiento (Performance) | Tareas largas, Resumen, fotogramas |
| ¿Cuánta memoria nueva por pulso? | Memoria, y la casilla Memoria de Rendimiento | Instantáneas comparadas y la gráfica del montón |
| ¿Se repinta la tabla o una celda? | Más herramientas → Renderizado | Destellos de pintura y FPS |
| ¿La CPU y el montón, en vivo? | Más herramientas → Monitor de rendimiento | CPU, montón JS, recálculos de estilo |
| ¿El pulso pide red? | Red (Network) | La tabla de peticiones mientras emite |

Hace falta el servidor de desarrollo (`npm run dev`). Ese build conserva los nombres `Fila`, `Codigo`, `Semaforo`. Con `npm run preview` React va en producción: el Profiler no graba esos nombres y los tiempos no son comparables con esta guía.

Las pestañas de Chrome pueden estar en español o en inglés. Abajo va el nombre en español y, entre paréntesis, el inglés. La extensión React DevTools va en inglés: Components y Profiler. Esas dos llevan el logo de React. Rendimiento no las sustituye: no lista `Fila`.

`main.tsx` envuelve las dos apps en `StrictMode`. En desarrollo React ejecuta la función del componente dos veces por commit. `data-renders` sube de dos en dos. El texto «hace n segundos» sube de uno en uno. El Profiler sigue mostrando un solo commit.

## 1. La página, antes de abrir herramientas

1. Deja la cadencia en **8**. Es el valor de arranque. El botón − y el botón + recorren 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 y 100. El número en negrita es la cadencia pedida.
2. Lee la línea `procesa …/s · renders …/s`.
   - **procesa** cuenta pulsos que el `setInterval` ha llegado a entregar.
   - **renders** cuenta commits de la cabecera (`Cabecera`), no las celdas.
   - Si **procesa** está por debajo del número en negrita, el intervalo espera: el commit anterior aún ocupaba el hilo. Sube con + hasta verlo en A. En B, a la misma cadencia, **procesa** sigue cerca del número pedido.
   - Si **renders** queda por debajo de **procesa**, varios pulsos han entrado en el mismo commit de la cabecera. Un punto de diferencia puede ser el redondeo del segundo que acaba de cerrar.
3. Mira el ámbar. Cada vez que la función de ese nodo vuelve a ejecutarse, la clase pasa de `marca-a` a `marca-b` (o al revés) y el CSS repite la animación. El primer pintado no lleva ámbar.
4. Con la emisión en marcha, en A el ámbar recorre la cabecera, el menú, los títulos y las mil filas. En B el ámbar va a la cabecera y, en la fila del pulso, al semáforo y a «hace n segundos». El resto de la fila se queda en el color de antes.
5. Pulsa **Pausar emisión**. El ámbar de código, destino, menú y cabecera se detiene en las dos. La columna Actualizado sigue destellando, una vez por segundo, en las mil filas de las dos apps. Ese destello es el tic, no el pulso.
6. Pulsa **Reanudar emisión** cuando vayas a grabar el pulso.

La leyenda del header («El fondo ámbar es un render») es esta misma señal, sin DevTools.

## 2. Elementos: la causa en un nodo

F12. Pestaña **Elementos** (Elements).

1. Con la emisión en pausa, en el árbol del DOM baja hasta una fila. Cada celda es un `div` con `data-campo` y `data-renders`. Los `data-campo` son `codigo`, `linea`, `destino`, `parada`, `sentido`, `ocupacion`, `semaforo`, `actualizado`, `velocidad`, `retraso`, `coche`, `servicio`.
2. Pulsa una celda de código en la página (el primer autobús vale) para que Elementos la deje seleccionada. Si el clic además marca la fila, la fila gana la clase `fila marcada`. Eso es el estado local de la fila; no es el pulso.
3. Anota `data-renders` de esa celda, el de la celda Actualizado de la misma fila, el del `header` (`data-chrome="cabecera"`) y el del `nav` (`data-chrome="menu"`).
4. Pulsa **Reanudar emisión**. Espera unos segundos. Mira los cuatro números sin soltar la selección.
5. Pulsa **Pausar emisión** y vuelve a leer.

Lectura en A, con la emisión en marcha:

- `data-renders` de código, del menú y de la cabecera suben a la par. Un pulso ha ejecutado el menú y una celda cuyo texto no cambió.
- La clase de esa celda de código alterna `marca-a` y `marca-b`.
- Actualizado sube al menos lo mismo, y un poco más cuando cae el tic.

Lectura en B, con la emisión en marcha:

- El código se queda en el número que tenía al cargar (2 si no has hecho nada más: el montaje en `StrictMode`).
- El menú se queda en ese mismo 2.
- La cabecera sube en cada pulso, de dos en dos. La causa es el texto del último pulso, que vive en `Control` y llega a `Cabecera` por props.
- El semáforo de la fila que recibió el pulso sube. Las otras filas, no. Con mil filas y 8 pulsos por segundo, una fila concreta tarda en salir: no elijas una al azar y concluyas que B no pinta. El paso de la consola, más abajo, cuenta las mil.
- Actualizado sube en las mil filas por el tic. La fila del pulso sube un paso más, porque el pulso pone el contador a 0.

Para ver el momento exacto en que React escribe el DOM:

1. Clic derecho en el atributo `data-renders` de una celda de código → **Interrumpir en** → **modificaciones de atributo** (Break on → attribute modifications).
2. Reanuda la emisión.
3. En A el depurador se para enseguida, con esa celda marcada en el DOM. La pila está dentro de `react-dom`: es el commit aplicando la clase y el atributo. Pulsa continuar (F8) y se vuelve a parar en el pulso siguiente.
4. Quita el punto de interrupción (el menú del atributo, o el panel Fuentes / Sources, en Puntos de interrupción).
5. Repite la misma interrupción en B, en una celda de código. La emisión sigue y el depurador no se para en ese nodo. El pulso no escribe esa celda.

El clic y el menú, con la emisión en pausa, separan la causa:

1. Pausa. Anota `data-renders` de la primera celda de código y del menú.
2. Clic en la primera fila. La fila pasa a `fila marcada`. En A las doce celdas de esa fila suman 2. Las otras filas no se mueven. En B la fila también pasa a `fila marcada` y las doce celdas conservan el número: `memo` ve el mismo `id` y no las ejecuta.
3. Clic en **Mapa**. La nota pasa a «Capa activa: Mapa». `data-renders` del `nav` suma 2. La tabla, en las dos apps, se queda como estaba. El estado de la capa vive dentro de `Menu`. Un clic ahí no es un pulso.

El botón + con la emisión en pausa es otro commit de una sola causa. En A el estado de la cadencia está en `App`, así que el + ejecuta lista, filas y celdas una vez. En B el estado está en `Control`, así que el + ejecuta la cabecera y la tabla conserva `data-renders`.

## 3. Consola: las mil celdas a la vez

Elementos enseña un nodo. Esto enseña el histograma. Pestaña **Consola** (Console). Pega esto, pulsa Intro, espera tres segundos, pégalo otra vez.

```js
const cuenta = (campo) => {
  const veces = new Map()
  for (const nodo of document.querySelectorAll(`[data-campo="${campo}"]`)) {
    const n = nodo.dataset.renders
    veces.set(n, (veces.get(n) ?? 0) + 1)
  }
  return Object.fromEntries(veces)
}
({
  cabecera: document.querySelector('[data-chrome="cabecera"]').dataset.renders,
  menu: document.querySelector('[data-chrome="menu"]').dataset.renders,
  codigo: cuenta("codigo"),
  semaforo: cuenta("semaforo"),
  actualizado: cuenta("actualizado"),
})
```

Cómo se lee el objeto. La clave es el valor de `data-renders`. El valor es cuántas celdas tienen ese número. Por el `StrictMode`, cada commit después del montaje suma 2: montaje `2`, un commit más `4`, dos commits más `6`.

Con la emisión en marcha, en A las tres columnas salen de una sola clave, y esa clave sube entre la primera lectura y la segunda. Menú y cabecera suben lo mismo. Las mil celdas de código se han ejecutado en cada pulso.

En B, en la segunda lectura:

- `codigo` sigue en `{ "2": 1000 }`. Ninguna celda de código se ha vuelto a ejecutar.
- `menu` sigue en `"2"`.
- `cabecera` ha subido de dos en dos, una vez por pulso.
- `semaforo` reparte las mil filas. La mayoría sigue en `"2"`. Un grupo está en `"4"` (un pulso) y, si esperas, alguno en `"6"` (dos pulsos). Solo esas filas ejecutaron `Semaforo`.
- `actualizado` tiene una clave baja compartida por casi todas las filas: el tic. Las claves más altas son las filas que, además, recibieron un pulso.

Pausa y espera tres segundos. Vuelve a pegar el fragmento. En las dos apps, `codigo` y `menu` quietos, `actualizado` sube en las mil filas. Eso aísla el tic.

## 4. Components: props, memo y el borde de «highlight»

Instala [React Developer Tools](https://react.dev/learn/react-developer-tools) en el Chrome con el que abres el puerto. Recarga. En la barra de F12 aparecen **Components** y **Profiler**, con el logo de React. Si no caben, están detrás de `>>`.

1. Pestaña **Components**. El engranaje de esa pestaña tiene **Highlight updates when components render**. Actívalo.
2. Reanuda la emisión.
3. En A el borde del highlight recorre la cabecera, el menú y la tabla. En B el borde va a la cabecera y a la celda del semáforo y la de Actualizado de una fila. Es el mismo hecho que el ámbar, dibujado por la extensión.
4. Pausa. El highlight de la tabla se detiene. Una vez por segundo se marcan las celdas Actualizado, en las dos.
5. Desactiva el highlight antes de grabar Rendimiento. El borde es trabajo de más y ensucia el tiempo de pintura.

El árbol de A, de arriba abajo: `App`, `Cabecera`, `Ritmo`, `Menu`, `Lista`, mil `Fila`, y dentro de cada fila `Codigo`, `Linea`, `Destino`, `Parada`, `Sentido`, `Ocupacion`, `Semaforo`, `Actualizado`, `Velocidad`, `Retraso`, `Coche`, `Servicio`. Cada celda envuelve un `Casilla`. `Semaforo` envuelve además un `Luz`.

El árbol de B añade `Control` entre `App` y `Cabecera`. `Lista`, `Fila` y las celdas llevan la pastilla **Memo**.

El buscador de Components (arriba del árbol) evita bajar las mil filas a mano. Escribe `Menu`, `Codigo` o `Semaforo`.

1. En A, selecciona una `Fila`. A la derecha, **props** trae `bus`: el objeto entero. **hooks** trae el estado `marcada`.
2. En A, selecciona `App`. **hooks** trae la lista de mil autobuses, `enMarcha`, `cadencia` y el texto del último pulso. Un `setState` aquí es la causa del pulso en A.
3. En B, selecciona una `Fila`. **props** trae `id`, un número. La pastilla Memo está en la fila.
4. En B, selecciona un `Semaforo`. **props** trae ese mismo `id`. **hooks** trae el valor leído con `useSyncExternalStore`. Selecciona `App`: no hay estado de la lista. El pulso no entra por `App`.
5. Selecciona `Menu` en cualquiera de las dos. **hooks** trae la capa (`Flota`, `Mapa`, …). No recibe la lista.

## 5. Profiler: el commit, la causa y el coste en React

La pestaña **Profiler** no es Rendimiento. Mide el render de React: qué función se ejecutó en ese commit y un tiempo de ese render.

1. Engranaje del Profiler. Activa **Record why each component rendered while profiling**. Sin eso, la barra dice quién se ejecutó y calla el porqué. La casilla **Hide commits below** déjala en 0. Los commits de B duran poco; un umbral alto los esconde y B parece vacío.
2. Pausa la emisión. Si grabas con el emisor ya en marcha, el primer segundo mezcla pulsos viejos.
3. El círculo azul de arriba a la izquierda graba con la página ya abierta. El botón de al lado recarga y graba el primer pintado: no es el pulso. También vale **Start recording** si aún no hay grabación.
4. Pulsa el círculo. Pulsa **Reanudar emisión**. Cuenta dos segundos. Pulsa **Pausar emisión**. Pulsa el círculo otra vez (o **Stop recording**).

Arriba queda una barra por commit. El ancho es la duración. En A las barras del pulso son anchas. En B son estrechas, y hay unas pocas más anchas: el tic de las mil `Actualizado`.

Pulsa una barra. Abajo, la gráfica de llamas (Flamegraph; el icono de la llama). Una barra con color se ejecutó. Una barra gris, rayada, estaba en el camino y no se ejecutó. A la derecha, al pulsar un componente, **Why did this render?** da la causa. El texto sale en inglés. Copia el que salga; los de esta app son estos:

| Texto | Causa |
| --- | --- |
| Hooks changed | Cambió un `useState`, un `useReducer` o el snapshot de `useSyncExternalStore` |
| Props changed | Cambió alguna prop. Entre paréntesis va el nombre: `detalle`, `bus`, `autobuses`, `valor`, `reinicio` |
| The parent component rendered | El padre se ejecutó. Este hijo no tiene `memo`, así que se ejecuta aunque sus props sean las mismas |
| This is the first render | Montaje. No es el pulso |

La vista **Ranked** (barras ordenadas) lista los componentes por tiempo propio, no por el sitio que ocupan en el árbol. Sirve para ver quién se come el commit cuando la llama es un bloque macizo. La vista **Timeline** pone los commits en el tiempo: en A el pulso es una franja seguida; en B son marcas cortas y, cada segundo, el bloque del tic.

### El commit del pulso en A

Elige una barra ancha que contenga `Menu` y `Codigo`. Si la barra solo contiene `Actualizado`, es el tic: elige otra.

Se ejecutaron, con color:

- `App`. Why: **Hooks changed**. Ahí están `setAutobuses` y `setUltimo`, en el mismo callback del intervalo, así que React los junta en un commit.
- `Cabecera`. Why: **Props changed (`detalle`)**. El párrafo del último autobús es otro string.
- `Ritmo`. Why: **The parent component rendered**. Es hijo de `Cabecera` y no tiene `memo`. Su propio texto (`procesa` / `renders`) cambia por otro intervalo, de un segundo.
- `Menu`. Why: **The parent component rendered**. No recibe props. El pulso no cambia la capa. Aun así la función corre, porque `App` se ha ejecutado y `Menu` no tiene `memo`.
- `Lista`. Why: **Props changed (`autobuses`)**. Cada pulso crea un array nuevo.
- Las mil `Fila`. La fila cuyo autobús cambió: **Props changed (`bus`)**, objeto nuevo. Las otras 999: **The parent component rendered**. El objeto `bus` de esas filas es el mismo (el pulso hace `return bus`), pero no hay `memo`, así que corren igual.
- Las doce celdas de cada fila, sus `Casilla` y los `Luz` de cada semáforo. En la fila tocada, `Semaforo` dice **Props changed (`valor`)** y `Actualizado` dice **Props changed (`reinicio`)**. En el resto, **The parent component rendered**: el `valor` es el mismo primitivo.

La consecuencia dentro de React: un pulso ejecuta la cabecera, el menú, la lista, mil filas y doce mil celdas. El ancho de la barra es ese trabajo. La consecuencia en pantalla es el ámbar en todos esos nodos.

### El commit del pulso en B

Elige una barra estrecha que contenga `Cabecera` y un solo `Semaforo`. Se ejecutaron:

- `Control`. Why: **Hooks changed**. El `setUltimo` del texto del header.
- `Cabecera`. Why: **Props changed (`detalle`)**.
- `Ritmo`. Why: **The parent component rendered**.
- Un `Semaforo`. Why: **Hooks changed**. El store avisó a la suscripción de esa fila y esa columna. La prop `id` no cambió.
- El `Casilla` y el `Luz` de ese semáforo. Why: **The parent component rendered**.
- Un `Actualizado` de la misma fila. Why: **Hooks changed**. El store avisó también a la columna del contador, y el texto pasa a «hace 0 s».
- El `Casilla` de ese `Actualizado`.

`App` no está en ese commit: no tiene estado. `Menu`, `Lista`, `Fila`, `Codigo`, `Linea`, `Destino` y el resto de celdas no se ejecutaron. Si alguno sale en el camino, va rayado: `memo` comparó `id` y era el mismo, o el padre ni siquiera se ejecutó.

La consecuencia: el commit nombra una fila, no las mil. El ancho de la barra cabe en una fracción de la barra de A.

### El commit del tic, en las dos

Pausa. Círculo, espera un poco más de un segundo, para. La barra del segundo contiene `Actualizado` y su `Casilla`, mil veces. No contiene `Menu` ni `Codigo`. Why de cada `Actualizado`: **Hooks changed** (`useSegundos` suma 1). `Fila` no se ejecuta: el estado del contador vive dentro de la celda.

En B esa barra puede ser la más ancha de la grabación. El coste que comparten las dos apps es pintar mil contadores cada segundo. El coste que las separa es el pulso.

Puede salir además una barra fina con solo `Ritmo`. Es el texto `procesa …/s · renders …/s`, que se actualiza cada segundo por su cuenta y no arrastra la cabecera.

### El commit de un clic

Pausa. Círculo, un clic en una fila, para.

- En A: `Fila` con **Hooks changed** (`marcada`) y las doce celdas con **The parent component rendered**. El `valor` no cambió. Corrieron porque el padre corrió.
- En B: `Fila` con **Hooks changed**. Las doce celdas salen rayadas. `memo` y el mismo `id`. En pantalla la fila se marca igual; React no ha vuelto a ejecutar las celdas.

Pausa. Círculo, clic en **Mapa**, para. En las dos: solo `Menu`, **Hooks changed**. La tabla no entra en el commit. Sirve de control: un `setState` local no repinta la flota. El pulso de A sí, porque el `setState` está en `App`, por encima de la lista.

Pausa. Círculo, clic en +, para.

- En A el commit tiene la misma forma que un pulso: `App` y, debajo, menú, lista y filas. La causa es otra (`cadencia`), el alcance es el mismo.
- En B el commit es `Control` y `Cabecera`. `Lista` no se ejecuta.

## 6. Rendimiento: lo que el commit le cuesta al navegador

Pestaña **Rendimiento** (Performance). No conoce `Fila`. Dice en qué se fue el tiempo del hilo principal: script, estilo, layout, pintura, frames.

1. Cierra el highlight de React y los destellos de pintura si los habías activado.
2. Pausa la emisión.
3. En la barra de Rendimiento, la ralentización de CPU (CPU throttling). Para la primera toma déjala en **Sin ralentización** (No throttling). La segunda toma, más abajo, usa 4×.
4. El círculo es **Grabar** (Record). El botón de al lado recarga la página y graba el arranque: no es el pulso.
5. Círculo. **Reanudar emisión**. Dos segundos. **Pausar emisión**. Círculo otra vez, para parar.
6. Haz la misma toma en la otra app, con la primera en pausa.

Al terminar, el panel **Resumen** (Summary) parte el intervalo:

- **Secuencias de comandos** (Scripting): JavaScript. Compara las dos tomas a la misma cadencia: en A esa porción es más grande. En B queda el pulso corto y el pico de cada tic.
- **Renderizado** (Rendering): recálculo de estilo y layout. En A sube porque cada pulso cambia la clase `marca-a` / `marca-b` de miles de nodos. En B el estilo cambia en la cabecera y en dos celdas, y cada segundo en la columna Actualizado.
- **Pintura** (Painting): los píxeles. Sigue al renderizado: mucha superficie en A, poca en B.
- La fila de red de esa grabación, si aparece `127.0.0.1` con 0 kB, es la página que ya estaba cargada. El pulso no descarga nada. El detalle está en la sección Red.

En el carril **Fotogramas** (Frames) cada pastilla es un frame. Un frame a 60 Hz dispone de unos 16 ms. Si la pastilla del pulso la supera, ese frame llegó tarde. En A pasa al subir la cadencia, y antes si la CPU está al 4×. En B el pulso aguanta más cerca de esos 16 ms; la pastilla larga, si sale, es la del tic: mil `Actualizado` de una vez.

En el carril del hilo principal (Main), una tarea con triángulo rojo pasa de 50 ms: es una tarea larga. Pulsa la tarea amarilla (script). En el **Árbol de llamadas** (Call tree) y en **De abajo arriba** (Bottom-Up) el tiempo cae dentro de `react-dom` y, en este build de desarrollo, en funciones con el nombre del componente (`App`, `Lista`, `Fila`, `Casilla` en A; `Control`, `Semaforo`, `Actualizado` en B). El nombre del componente en este carril es la consecuencia medida en milisegundos. La causa sigue siendo la del Profiler: quién pidió el commit.

Para no atribuir al pulso el coste del tic:

1. Pausa. Graba tres segundos sin reanudar. Para.
2. Las tareas que queden son el tic (mil `Actualizado`) y el texto de `Ritmo`. Salen en las dos apps.
3. Graba otros tres segundos con la emisión en marcha. Las tareas que se añaden son el pulso. En A se añaden muchas y largas. En B se añaden tareas cortas, una por pulso, además del tic que ya habías visto.

Segunda toma, con la CPU a **4×** (4× slowdown). Mismo gesto. En A las tareas largas se encadenan y **procesa** baja del número pedido: el intervalo espera a que el commit anterior suelte el hilo. En B, a 4× y cadencia 8, el pulso sigue en tareas cortas; si subes la cadencia con +, el header dice hasta dónde llega **procesa**. Los milisegundos son de desarrollo y de esta ralentización: sirven para comparar A con B en la misma máquina.

La casilla **Memoria** (Memory) de esta misma grabación añade la gráfica del montón de JavaScript. Márcala antes de dar al círculo, repite la toma de dos segundos. En A el montón hace diente de sierra: cada pulso reserva un array nuevo de mil puestos y un objeto nuevo para el autobús tocado, y el recolector los suelta después. En B el store escribe en los arrays que ya tenía (`semaforos[id]`, `reinicios[id]`); la gráfica se mueve poco, salvo el string del header y el tic. El número de nodos DOM es el mismo en las dos: mil filas por doce celdas. La diferencia de montón es objeto JavaScript, no un DOM más grande.

## 7. Memoria: qué se reserva en cada pulso

Pestaña **Memoria** (Memory). Aquí el dato es el objeto vivo, no el tiempo.

1. Pausa. Elige **Instantánea del montón** (Heap snapshot). **Tomar instantánea** (Take snapshot). Es la línea de base. Hazlo en las dos pestañas, con las dos en pausa: los constructores de las mil filas se parecen. El DOM de la tabla está en los dos montones.
2. En A, reanuda, espera unos diez segundos, pausa. Segunda instantánea. Arriba del panel, cambia la vista de **Resumen** (Summary) a **Comparación** (Comparison) y elige la primera instantánea como base.
3. Ordena por **# Nuevo** (Alloc. size / # New, según el idioma). Verás arrays y objetos creados entre las dos fotos: son la lista nueva de cada pulso y la copia del autobús. Muchos ya figuran también como eliminados, porque el recolector ha pasado. El dato es el recambio, no un montón que crezca sin límite.
4. La misma pareja de instantáneas en B, diez segundos emitiendo. El recambio es pequeño: strings del header y los objetos del tic. No aparece un array nuevo de mil autobuses por pulso, porque el store muta los dos arrays que creó al cargar.

La otra radio del panel, **Instrumentación de asignación en la línea de tiempo** (Allocation instrumentation on timeline), graba el momento. Pausa, elige esa radio, **Iniciar** (Start), reanuda dos segundos, pausa, para la grabación. Las barras azules son bytes reservados. En A hay una barra por pulso. En B las barras del pulso son finas; cada segundo aparece la del tic, en las dos.

**Muestreo de asignaciones** (Allocation sampling) es la misma pregunta con menos detalle. Con la instrumentación basta.

Los nodos DOM separados (detached) no son la diferencia: las dos apps conservan la tabla montada.

## 8. Renderizado y el monitor en vivo

Menú de los tres puntos de DevTools → **Más herramientas** (More tools).

**Renderizado** (Rendering):

1. Activa **Destellos de pintura** (Paint flashing).
2. Reanuda. En A el verde cubre la tabla en cada pulso. En B el verde cae en la línea del header y en la celda que cambió. Con la emisión en pausa, el verde de las dos queda en la columna Actualizado, una vez por segundo.
3. Activa **Estadísticas de renderizado del marco** (Frame rendering stats). El recuadro de FPS, arriba a la izquierda, baja en A cuando la cadencia sube. En B se mantiene mientras el pulso quepa en el frame.
4. Desactiva las dos casillas al acabar. Los destellos añaden pintura y falsean una grabación de Rendimiento posterior.

**Monitor de rendimiento** (Performance monitor). Se abre un panel con números en vivo, sin grabar:

| Fila del monitor | En A, emitiendo | En B, emitiendo |
| --- | --- | --- |
| Uso de CPU | Alto, y más alto al pulsar + | Bajo a la misma cadencia |
| Tamaño del montón de JS | Diente de sierra | Casi plano |
| Nodos del DOM | Los mismos, unas doce mil celdas más la cabecera | Los mismos |
| Receptores de eventos JS | Los de las filas y los botones; no crecen con el pulso | Igual |
| Recálculos de estilo / s | Muchos: la clase ámbar cambia en miles de nodos | Pocos: cabecera, dos celdas, y cada segundo la columna Actualizado |
| Diseños / s (layouts) | Acompaña al recálculo | Acompaña al recálculo, con menos nodos |

Pausa las dos y mira el monitor otra vez. La CPU baja. Lo que queda, en las dos, es el tic de Actualizado.

## 9. Red: el pulso no es una petición

Pestaña **Red** (Network). El círculo tachado vacía la lista (**Borrar registro de red**).

1. Vacía. Reanuda la emisión unos segundos. Pausa.
2. Filtro **Fetch/XHR**. La tabla sigue vacía. El emisor es un `setInterval` de la página, no un WebSocket de datos ni un JSON.
3. Filtro **WS**. Si aparece un socket, es el de Vite (recarga del desarrollo), no un autobús. No gana mensajes al ritmo de la cadencia.
4. Filtro **Doc** (Documento). Sigue habiendo una sola fila, la de `a.html` o `b.html`, de cuando cargaste. El pulso no vuelve a pedir el documento.

La consecuencia cara está en el hilo principal y en el commit de React. En Red no hay filas nuevas que la expliquen.

Lighthouse, en la misma barra de F12, recarga la URL y puntúa esa carga. Las dos páginas bajan un documento parecido. El pulso, que ocurre después de cargar, no entra en esa puntuación. Para este contraste la lectura es Profiler y Rendimiento.

## 10. Lectura de una pasada

Misma cadencia, una app en pausa mientras grabas la otra. Para cada gesto, la causa es quién pidió el render; la consecuencia es quién corrió y qué hizo el navegador.

| Gesto | Causa | Consecuencia en A | Consecuencia en B |
| --- | --- | --- | --- |
| Pulso | A: `setState` en `App`. B: escritura en el store y `setUltimo` en `Control` | Commit con `Menu`, `Lista`, mil `Fila` y doce mil celdas. Ámbar en toda la tabla. Tarea larga, estilo y pintura de miles de nodos. Array nuevo en el montón | Commit con `Control`, `Cabecera`, un `Semaforo` y un `Actualizado`. Menú y `Codigo` quietos. Tarea corta. El store no reserva la lista |
| Tic (emisión en pausa) | `useSegundos` en cada `Actualizado` | Mil `Actualizado` y sus `Casilla`. Ni `Menu` ni `Codigo` | La misma mil. Es el coste común |
| Clic en una fila | `setState` de `marcada` dentro de `Fila` | Esa `Fila` y sus doce celdas | Esa `Fila`. Las celdas quedan rayadas en el Profiler |
| Clic en Mapa | `setState` dentro de `Menu` | Solo `Menu` | Solo `Menu` |
| Clic en + | `setCadencia` en `App` (A) o en `Control` (B) | Un commit con forma de pulso: baja hasta las celdas | `Control` y `Cabecera`. La tabla conserva `data-renders` |
