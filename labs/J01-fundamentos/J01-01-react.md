# J01-01 — Introducción a React

[← Página anterior](README.md) · [Siguiente página →](J01-02-spa.md)

Un componente es una función cuyo nombre empieza en mayúscula y que devuelve interfaz. `App` es el componente de entrada. `main.tsx` busca el nodo `#raiz` de `index.html` y pinta ahí `<App />`. El título que se lee en la página sale del `<h1>` de `App`, no del HTML.

## Demostración

### Objetivo

Ver que el título de la página sale del componente `App`, no del HTML.

### Código de partida

En `bandeja/`, `npm run dev`. Abre `http://localhost:5173`.

`bandeja/index.html` tiene el nodo y el script. El título del `<head>` no es el de la página:

```html
<div id="raiz"></div>
<script type="module" src="/src/main.tsx"></script>
```

`bandeja/src/main.tsx` monta `App` en ese nodo:

```tsx
createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`bandeja/src/App.tsx` pinta el título que se lee:

```tsx
<h1>Bandeja de entregables</h1>
```

### 1 — Del HTML al componente

**Dónde:** `bandeja/index.html`, `bandeja/src/main.tsx` y `bandeja/src/App.tsx`.

**Qué haces:**

1. En `index.html`, localiza `<div id="raiz">`. No lo cambies.
2. En `main.tsx`, localiza `createRoot` y `<App />`.
3. En `App.tsx`, cambia el texto del `<h1>` a `Bandeja en revisión`. Guarda.
4. Mira el navegador. Restaura `Bandeja de entregables`.

**Experimento:** borra un momento el `id="raiz"` del HTML y guarda. Lee la terminal de Vite o la consola. Restaura `id="raiz"`.

→ Sin el nodo, `main.tsx` lanza «No está el nodo #raiz» y la página no pinta. Con el id restaurado, vuelve el título.

**Validación:**

- El `<h1>` del navegador coincide con el de `App.tsx`.
- `index.html` no contiene el texto «Bandeja de entregables».

## Comprueba tu entendimiento

**Quién pinta**
El título está en `App`, y `main.tsx` monta `App` en `#raiz`.
→ Cambiar el `<h1>` y guardar cambia la página. Cambiar un comentario del HTML no cambia ese título.

## Reto

### 1 — El párrafo que no está en el HTML

Añade bajo el `<h1>` un `<p>Hola</p>`. Guarda. Quítalo.

<details>
<summary>Ver solución</summary>

«Hola» aparece en el navegador y no está en `index.html`. Al quitar el párrafo, desaparece.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| La página no cambia | Miras `index.html` | El título está en `App.tsx` |
| `No está el nodo #raiz` | El `id` del `div` no coincide | `id="raiz"`, como en `main.tsx` |

## Laboratorio

La demostración cambió el título. Aquí el título se queda. Añades un segundo componente.

### Objetivo

Pintar un pie de página desde otra función, no desde `index.html`.

### Código de partida

`App` sigue con `<h1>Bandeja de entregables</h1>`. `index.html` no tiene ese texto ni un pie.

### Qué haces

1. Crea `bandeja/src/componentes/Pie.tsx`.
2. En `App`, impórtalo y ponlo debajo de la lista.
3. Mira el HTML del documento: el pie no está en `index.html`.
4. Borra `<Pie />` un momento. El pie desaparece. Vuelve a ponerlo.

```tsx
export default function Pie() {
  return <p>Seis entregables en la bandeja.</p>
}
```

```tsx
import Pie from "./componentes/Pie"
```

```tsx
<Pie />
```

→ El pie se lee bajo las fichas. En `index.html` no aparece «Seis entregables». Quitar `<Pie />` lo quita de la página.

**Validación:** `Pie` es una función en su archivo. El `<h1>` sigue siendo «Bandeja de entregables».
