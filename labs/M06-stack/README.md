# M06 — El stack

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


[← Página anterior](../../README.md) · [Siguiente página →](M06-01-stack.md)

> [!NOTE]
> Este módulo no sigue la bandeja. Monta otra aplicación, `panel/`, y la usa. La bandeja se queda en el puerto 5173.

## Qué aprenderás

- Reconocer cada capa del stack y el fichero donde vive.
- Seguir la dirección `routes` → `pages` → `features` → `api`.
- Entrar con Keycloak, leer avisos, publicar uno y cambiar el idioma.
- Dejar un test al lado del código que decide, y pasar `npm run check`.

## Teoría

| Capa | Elección | Dónde se ve |
|------|----------|-------------|
| UI | React 19 + TypeScript | `panel/src` |
| Estilos | Tailwind CSS v4 | `src/index.css` (`@import "tailwindcss"`) |
| Bundler | Vite | `vite.config.ts`, puerto 5174 |
| Datos | TanStack Query + axios | `src/api/`, un `use-*.ts` por endpoint |
| Formularios | React Hook Form + Zod | `features/avisos/components/AvisoForm.tsx` y `src/api/aviso.ts` |
| Routing | React Router | `src/routes/AppRouter.tsx` |
| i18n | i18next + scanner (ca / es) | `src/libs/i18n/` |
| Auth | Provider + guard (Keycloak) | `src/providers/AuthProvider.tsx`, `src/auth/` |
| Tests | Vitest, espejo en `tests/` | `tests/` repite el árbol de `src/` |
| Calidad | ESLint, Prettier, Husky | `npm run check` y `.husky/pre-commit` |

La frase del flujo: `pages/` posee la ruta, `features/` la UI de producto, `api/` y TanStack Query los datos, `auth/` la sesión.

Una página importa la API pública de la feature (`features/avisos/index.tsx`). No importa `components/`. La feature importa `api/`. `api/` no importa la feature.

`src/api/` y `src/shared/` se crean cuando un entregable los necesita. En el panel hay `api/` porque hay un endpoint. No hay `shared/`: nadie lo usa, y no se deja una carpeta vacía.

```text
src/
  api/         use-avisos.ts y el schema del aviso
  auth/        singleton de Keycloak, guard, GuardRuta
  features/    UI de avisos; components/ no se reexporta
  pages/       composición de la ruta; pages/errors/ es el 404
  providers/   QueryProvider y AuthProvider
  routes/      AppRouter
  libs/i18n/   ca y es
  utils/       logger
  index.css    Tailwind y la base layer
```

## Demostración guiada

Punto de partida: otro proyecto, `panel/`. La bandeja sigue en el 5173 y no se toca. Hace falta Docker para Keycloak y `npm run dev` de `panel/` en el puerto 5174. El reino `curso` y el usuario `ana` / `ana` salen de `panel/keycloak/curso-realm.json`.

### 1 — Sin sesión no hay lista

En `http://localhost:5174/` la cabecera dice «Panel». El botón de idioma ofrece `ca`. Pulsarlo deja «Tauler». La ruta `/` no pinta avisos: pide entrar. El botón lleva a Keycloak, en el 8080.

### 2 — Entrar y leer

Usuario `ana`, contraseña `ana`. De vuelta, el botón dice salir y el nombre. La lista sale de `GET /api/avisos`. El primer aviso es «Corte de agua». En Network se ve esa petición. Recargar el idioma, si se guardó en `localStorage` con la clave `idioma`, sigue en catalán.

### 3 — Un título corto no sale

En el formulario, título `No` y un texto cualquiera. El envío no añade una fila. Se lee que el título necesita al menos 3 caracteres. Título `Ruido` y texto `Obras en el patio.` Publicar lo pone en la lista. Reiniciar Vite vacía lo publicado: la lista de desarrollo vive en memoria y vuelve a `public/avisos.json`.

### 4 — Una ruta que no existe

`/no-hay` enseña «Esta ruta no existe.» No pide sesión otra vez. Con el idioma en `ca`, «Aquesta ruta no existeix.»

Dónde queda: el panel en 5174, Keycloak en 8080, la bandeja en 5173. El laboratorio [M06-01](M06-01-stack.md) repite este recorrido y añade el escáner de i18n, los tests y `npm run check`.

## Ahora practica tú

| Lab | Título | Qué harás |
|-----|--------|-----------|
| M06-01 | [Montar y usar](M06-01-stack.md) | Levantar Keycloak y el panel, publicar un aviso y pasar `check` |

→ Empieza por **[M06-01 — Montar y usar](M06-01-stack.md)**.
