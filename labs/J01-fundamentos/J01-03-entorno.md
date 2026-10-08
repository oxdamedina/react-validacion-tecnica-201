# J01-03 — Entorno

[← Página anterior](J01-02-spa.md) · [Siguiente página →](J01-04-jsx.md)

Node ejecuta las herramientas. npm lanza los scripts de `package.json`. Vite sirve la bandeja en el puerto 5173 y, con `build`, deja el paquete en `dist/`. `npm run dev` recarga al guardar. Si el 5173 está ocupado, Vite se detiene.

## Demostración

### Objetivo

Arrancar Vite en el puerto 5173 y dejar un `build` que pase el comprobador de tipos.

### Código de partida

El directorio es `bandeja/`. Si faltan dependencias, `npm ci` dentro de `bandeja/`.

Los scripts que vas a lanzar están en `bandeja/package.json`:

```json
"dev": "vite --host 0.0.0.0 --port 5173 --strictPort",
"build": "tsc -p tsconfig.app.json --noEmit && vite build"
```

### 1 — Dev y build

**Dónde:** dos terminales, las dos en `bandeja/`.

**Qué haces:**

1. `npm run dev`. Deja esa terminal abierta.
2. Abre la URL del puerto 5173. Lee el título.
3. En la otra terminal, `npm run build`.
4. Mira que existe `dist/` y que el 5173 sigue mostrando la app.

**Experimento:** para el `dev` con Ctrl+C. Recarga el navegador. Vuelve a lanzar `npm run dev`.

→ Sin el proceso, la página no responde. Con `dev` otra vez, vuelve el título. `dist/` sigue en disco y no sustituye a `dev`.

**Validación:**

- El puerto es 5173. Si Vite dice que está ocupado, no elige otro: hay que liberar el puerto.
- `npm run build` termina sin error de TypeScript.

## Comprueba tu entendimiento

**Qué no es React**
`package.json` declara `dev` y `build`.
→ `dev` es Vite. React es la librería que `App.tsx` importa.

## Reto

### 1 — Un tipo roto y el build

En `datos.ts`, pon `estado: "listo"` en E-104. Lanza `npm run build`. Restaura `"rechazado"`.

<details>
<summary>Ver solución</summary>

`build` falla en esa línea. `"listo"` no está en el tipo. Al restaurar, `build` termina.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| No encuentra un módulo | No hay `node_modules` | `npm ci` en `bandeja/` y otra vez `dev` |
| El puerto no es 5173 | Otro proceso lo ocupa | Ciérralo. Vite está con `--strictPort` |

## Laboratorio

La demostración arrancó `dev` y `build`. Aquí añades un script que solo comprueba tipos.

### Objetivo

Tener un script `comprobar` que no sirve la página ni crea `dist/`.

### Código de partida

Terminal en `bandeja/`. `npm run dev` puede estar parado.

### Qué haces

1. En `package.json`, dentro de `"scripts"`, añade la línea.
2. `npm run comprobar`.
3. Mira si apareció `dist/`.
4. Puedes dejar el script.

```json
"comprobar": "tsc -p tsconfig.app.json --noEmit"
```

→ El comando termina sin error y no crea `dist/`. `npm run dev` sigue siendo el que abre el 5173.
