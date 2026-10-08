# Práctica — Datos, pintado y un caso

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


> Esta carpeta no es el recorrido. La petición está en [M03-01](../M03-apis-y-arquitectura/M03-01-peticion.md). Medir y optimizar, en [M04](../M04-rendimiento/README.md). El caso de Cypress, en [M05-01](../M05-testing-y-validacion/M05-01-caso.md). Lo de aquí queda como material aparte.

[← Página anterior](../M03-apis-y-arquitectura/01-peticion.md) · [Siguiente página →](M05-01-fetch.md)

> [!NOTE]
> La lista deja de nacer en `datos.ts` y pasa a llegar por HTTP. Los dos últimos laboratorios solo comprueban el pintado de más y un recorrido automático. No cambian de tema: cierran la bandeja.

## Qué aprenderás

- Pedir el JSON y aceptar solo `Entregable[]`.
- Distinguir carga, error y vacío.
- Ver cuándo `memo` se salta un pintado, y dejar un caso de Cypress del filtro.

## Teoría

`fetch` devuelve `unknown` hasta que tú compruebas la forma. Un `as` a ciegas o un `any` darían por buena una respuesta que no es una lista de entregables.

Vacío es un filtro sin coincidencias. Error es una petición que no salió bien. Cargando es la espera. Son tres frases distintas.

## Demostración guiada

El guion está en [la petición](../M03-apis-y-arquitectura/01-peticion.md), [qué mirar](../M04-rendimiento/01-que-mirar.md) y [el recorrido](../M05-testing-y-validacion/01-recorrido.md).

Punto de partida: `useEntregables` importa `datos.ts`. `public/entregables.json` ya tiene los seis y la app no lo pide.

1. [M05-01](M05-01-fetch.md). `bandeja/src/api/entregables.ts` comprueba el JSON como `unknown`. El hook parte de `[]` y pide `/entregables.json` en un efecto con `[]`. Network muestra una petición al recargar y ninguna más al teclear. `"listo"` en E-104 rechaza la lista. Se restaura `"rechazado"`.
2. [M05-02](M05-02-finales.md). «Cargando entregables…» mientras espera. `"/no-esta.json"` muestra «No se pudo cargar la bandeja.» con `role="alert"`. Con la URL buena, `zzzz` muestra «Ningún entregable coincide.» y ese aviso no está.
3. [M05-03](M05-03-memo.md). `console.count(item.id)` dentro de `Tarjeta`, exportada con `memo`. Una letra en «Buscar» sigue contando: alguna prop nace de nuevo.
4. [M05-04](M05-04-usecallback.md). `useCallback` en `marcar` y `useMemo` en el valor del contexto, con `[revisor]`. La letra del buscador deja de contar. Escribir en «Revisor» vuelve a contar. Se quita `console.count`.
5. [M05-05](M05-05-caso.md). Se para `dev`. `npm run test:e2e` en `bandeja/`. El caso escribe `Este`, ve el inventario y no ve «Informe de accesibilidad». `zzzz` lo pone rojo. Se restituye `Este`.

Dónde queda: la bandeja carga el JSON, filtra y Cypress mira el texto, no el estado.

## Ahora practica tú

| Lab | Título | Qué harás |
|-----|--------|-----------|
| M05-01 | [La petición](M05-01-fetch.md) | Cargar y comprobar el JSON |
| M05-02 | [Tres finales](M05-02-finales.md) | Carga, error y vacío |
| M05-03 | [memo](M05-03-memo.md) | Contar pintados de la ficha |
| M05-04 | [useCallback](M05-04-usecallback.md) | Estabilizar lo que la ficha lee |
| M05-05 | [Un caso](M05-05-caso.md) | Cypress escribe en el filtro |

→ Empieza por **[M05-01 — La petición](M05-01-fetch.md)**.
