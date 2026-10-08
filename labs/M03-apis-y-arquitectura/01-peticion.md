# La petición y los tres finales

[← Página anterior](README.md) · [Siguiente página →](02-estructura.md)

`fetch` devuelve una promesa. El JSON, hasta comprobarlo, es `unknown`. Un `any` daría por buena cualquier respuesta. Un guarda mira campo a campo y solo entonces el valor es `Entregable[]`.

```tsx
function esEstado(valor: unknown): valor is EstadoEntregable {
  return valor === "pendiente" || valor === "revisado" || valor === "rechazado"
}
```

`respuesta.ok` importa. Un 404 no lanza solo. Si no se rechaza, una página de error acabaría tratada como lista.

Hay tres finales, y no son el mismo:

| Situación | Qué se ve | Qué no es |
|-----------|-----------|-----------|
| Cargando | «Cargando entregables…», sin fichas | Un error |
| Respuesta con datos | Las fichas | |
| Filtro sin coincidencias | «Ningún entregable coincide.» | Un fallo de red |
| La petición falla | Un aviso con `role="alert"` | Una lista en blanco |

> [!NOTE]
> Vacío y error se parecen si solo se mira «no hay fichas». El vacío es una respuesta válida. El error es que no hubo respuesta usable.

La petición no va en el cuerpo del componente, el que corre en cada pintado. Ahí se lanzaría otra vez en cada letra del filtro. Va en un efecto con `[]`, o en una función de `api/` que ese efecto llama. Una bandera `vivo` evita hacer `dispatch` si el hook ya se fue.

El estado inicial de la lista, cuando la fuente es la red, es `[]`. Quien la llena es la respuesta, no el import de `datos.ts`.

## Demostración guiada

Punto de partida: el `App.tsx` del laboratorio [M03-01](M03-01-peticion.md). Buscador, `marcar`, pestaña «Pendientes: 3», lista importada de `datos.ts`. Si el archivo del alumno no es ese, se pega el bloque del laboratorio y se sigue. `public/entregables.json` ya está.

1. En el navegador, `http://localhost:5173/entregables.json` muestra los seis objetos. Network, en la app, no tiene esa petición.
2. Se crea `bandeja/src/api/entregables.ts`. El JSON se lee como `unknown`. `"listo"` no pasa el guarda. La página no cambia: nadie llama a la función.
3. `items` pasa a empezar en `[]`. Un efecto con `[]` llama a `cargarEntregables`. Al recargar, Network muestra una petición y luego las seis fichas. Teclear no dispara otra.
4. `"estado": "listo"` en E-104 rechaza la lista. Se restaura `"rechazado"`.
5. La URL `"/no-esta.json"` muestra «No se pudo cargar la bandeja.» con `role="alert"`. Con la URL buena, `zzzz` muestra «Ningún entregable coincide.» y ese aviso no está.

Dónde queda: la lista nace del JSON y la petición sigue dentro de `App`. Sacarla es la página siguiente.

## Práctica

[M03-01 — La petición](M03-01-peticion.md). El laboratorio trae el `App.tsx` de partida. No hace falta haber terminado otra carpeta.
