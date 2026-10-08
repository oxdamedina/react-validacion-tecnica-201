# M04-01 — Medir

[← Página anterior](README.md) · [Siguiente página →](M04-02-optimizar.md)

> Práctica de [Qué mirar](01-que-mirar.md).

### Objetivo

Contar cuántas veces se ejecuta `Tarjeta` al teclear, y leer una pasada de Lighthouse, antes de cambiar nada.

### Código de partida

Hace falta una bandeja que filtre y marque. No hace falta el `fetch` ni `useEntregables`. Si `App.tsx` no tiene `visibles` y `marcar`, sustituye ese archivo por el código de partida de [M03-01](../M03-apis-y-arquitectura/M03-01-peticion.md) (el bloque de antes de la petición). Si ya filtra, no lo sustituyas.

`Tarjeta` tiene que seguir recibiendo `item` y `alMarcar`.

### En qué consiste

Un contador en consola y una herramienta del navegador. El experimento no optimiza: anota el número.

### 1 — El contador

**Dónde:** `bandeja/src/componentes/Tarjeta.tsx`, primera línea dentro de la función.

**Qué haces:**

1. Añade `console.count(item.id)`.
2. Recarga, abre la consola y límpiala.
3. Escribe una letra en «Buscar».
4. Borra la letra.

```tsx
export default function Tarjeta({
  item,
  textoBoton = "Anotar",
  alMarcar,
}: TarjetaProps) {
  console.count(item.id)
```

**Experimento:** anota el id que más crece. Marca E-101 y mira si el contador de E-103 también sube.

→ Una letra vuelve a ejecutar las fichas que siguen en pantalla. `App` se ha ejecutado otra vez y `marcar` es otra función. Marcar sube el contador de las fichas visibles, no solo el de la pulsada: el padre pintó la lista entera.

**Validación:**

- La consola muestra líneas `E-101: N` al teclear.
- La página se ve igual que antes del contador.
- No has envuelto nada en `memo` todavía.

### 2 — Lighthouse, una pasada

**Dónde:** el navegador, en la pestaña Lighthouse de las herramientas. Hace falta el puerto 5173 abierto.

**Qué haces:**

1. Modo navegación, solo la categoría Rendimiento.
2. Analiza la carga de la página.
3. Lee el peso y el tiempo de bloqueo. No cambies código para mejorar la nota.

**Experimento:** repite la pasada con `zzzz` escrito en la caja, si la herramienta vuelve a cargar `/`. La nota no es el objetivo. La pregunta es si el tiempo se fue en script o en la red.

→ En seis fichas la pasada sale holgada. El contador de la consola decía otra cosa: hay ejecuciones de más, y no se ven en esa nota.

**Validación:**

- Has leído al menos un número de la pasada.
- `console.count` sigue en `Tarjeta`. El laboratorio siguiente lo usa y luego se quita.

## Comprueba tu entendimiento

**Qué no mide el contador**
`console.count` no dice si la página va lenta.
→ Dice cuántas veces React llamó a la función. Lighthouse mira la carga. Son preguntas distintas.

## Reto

### 1 — Contar solo al filtrar

Deja el contador. Escribe `Este` y compara el número de E-104 con el de una ficha que desaparece.

<details>
<summary>Ver solución</summary>

E-104 sigue subiendo porque sigue montada. Una ficha que el filtro quita deja de contar hasta que vuelve. El contador no es el estado del entregable.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| La consola no cuenta | El `count` está fuera de la función o no guardaste | Primera línea del cuerpo de `Tarjeta` |
| No hay caja «Buscar» | `App` no es el de partida | Pega el `App.tsx` de M03-01, el de antes de la petición |
| Lighthouse no abre la app | El puerto no es 5173 o `dev` está parado | `npm run dev` dentro de `bandeja/` |
