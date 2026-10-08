# M04-02 — Una optimización

[← Página anterior](M04-01-medir.md) · [Siguiente página →](../M05-testing-y-validacion/README.md)

> Práctica de [Qué mirar](01-que-mirar.md).

### Objetivo

Hacer que teclear deje de volver a ejecutar las fichas cuyo `item` no cambió, y ver una dependencia de `useMemo` que miente.

### Código de partida

Si `Tarjeta` no tiene `console.count(item.id)`, añádelo como en [M04-01](M04-01-medir.md). Si `App` no filtra, pega el `App.tsx` de partida de [M03-01](../M03-apis-y-arquitectura/M03-01-peticion.md). El `fetch` puede estar o no: este laboratorio mira el pintado del filtro.

### En qué consiste

`memo` y `useCallback`. El experimento quita `texto` de un `useMemo` y lo devuelve. Al final se borra el contador.

### 1 — memo no basta

**Dónde:** `Tarjeta.tsx`.

**Qué haces:**

1. Importa `memo`.
2. La función deja de ser `export default function`. Pasa a `function Tarjeta`.
3. Al final del archivo, `export default memo(Tarjeta)`.
4. Limpia la consola y escribe una letra.

```tsx
import { memo } from "react"
import type { Entregable } from "../modelo"
```

```tsx
function Tarjeta({
  item,
  textoBoton = "Anotar",
  alMarcar,
}: TarjetaProps) {
  console.count(item.id)
  // el return no cambia
}

export default memo(Tarjeta)
```

**Experimento:** la letra sigue contando.

→ `alMarcar={marcar}` es una función nueva en cada pintado de `App`. `memo` compara la referencia y no se la salta.

### 2 — Estabilizar marcar

**Dónde:** `App.tsx`, o `useEntregables.ts` si `marcar` vive ahí.

**Qué haces:**

1. Importa `useCallback`.
2. Envuelve `marcar`.
3. Limpia la consola y escribe una letra.
4. Marca E-101.

```tsx
const marcar = useCallback((id: string): void => {
  setItems((lista) =>
    lista.map((item) =>
      item.id === id ? { ...item, estado: "revisado" } : item,
    ),
  )
}, [])
```

Si `marcar` era `function marcar`, sustituye esa función por esta constante. Las dependencias van vacías: solo usa `setItems`.

**Experimento:** una letra ya no aumenta el contador de las fichas que siguen igual. Marcar E-101 aumenta el de E-101, porque su `item` es otro objeto. Las demás, si siguen en pantalla, no tienen por qué subir.

→ Si siguen subiendo todas, `marcar` no es el `useCallback` que llega a la prop, o `Tarjeta` no está en `memo`.

### 3 — Una dependencia que miente

**Dónde:** el cálculo de `visibles` en `App.tsx`.

**Qué haces:**

1. Importa `useMemo`.
2. Envuelve el filtro con `[items, texto]`.
3. Escribe `Este`. Tiene que quedar el inventario.
4. Deja el array en `[items]`, recarga y escribe otra vez.
5. Devuelve `[items, texto]`.

```tsx
const visibles = useMemo(
  () =>
    items.filter((item) => {
      const blob = `${item.titulo} ${item.proveedor} ${item.id}`.toLowerCase()
      return blob.includes(texto.toLowerCase())
    }),
  [items, texto],
)
```

**Experimento:** con `[items]`, la caja muestra las letras y las fichas no se filtran.

→ `texto` cambió y el cálculo no se enteró. Se restituye `[items, texto]`. `Este` vuelve a dejar una ficha.

### 4 — Quitar el contador

Borra `console.count`. Deja `memo` y `useCallback`. En seis fichas no se nota al usarlas. El contador ya dijo por qué estaban.

## Comprueba tu entendimiento

**Qué aceleró el useMemo**
Con `[items, texto]`, el filtro se ve igual que con el `const` de antes.
→ En esta lista no hay una ganancia que contar. El `useMemo` sirvió para ver la dependencia rota, no para hacer la página rápida.

## Reto

### 1 — Partir un trozo

Crea `bandeja/src/componentes/Pie.tsx` con `export default function Pie() { return <p>Lista de entregables.</p> }`. En `App`, cárgalo con `lazy` y envuélvelo en `Suspense` con el respaldo «Cargando el pie…».

<details>
<summary>Ver solución</summary>

```tsx
import { lazy, Suspense } from "react"

const Pie = lazy(() => import("./componentes/Pie"))
```

```tsx
<Suspense fallback={<p>Cargando el pie…</p>}>
  <Pie />
</Suspense>
```

El pie aparece bajo la lista. El respaldo puede no llegar a verse: el trozo es pequeño. `lazy` parte el paquete. No hace la lista más rápida.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| El contador sigue en todas | `marcar` se crea en el cuerpo y no pasa por `useCallback` | La prop es la constante envuelta |
| `memo` no está aplicado | Sigue el `export default function` | `export default memo(Tarjeta)` |
| El filtro no vuelve | El `useMemo` se quedó en `[items]` | Dependencias `[items, texto]` |
