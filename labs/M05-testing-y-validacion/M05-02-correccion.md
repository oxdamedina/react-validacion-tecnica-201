# M05-02 — Corregir lo que el caso ve

[← Página anterior](M05-01-caso.md) · [Siguiente página →](../../README.md)

> Práctica de [El recorrido y el checklist](01-recorrido.md).

### Objetivo

Romper el filtro a propósito, ver el caso rojo, arreglarlo y dejar el caso en el archivo.

### Código de partida

[M05-01](M05-01-caso.md) ya añadió el caso que escribe `Este`. Si no está, pégalo ahora en `bandeja/cypress/e2e/bandeja.cy.js`. La bandeja tiene `#filtro` y las seis fichas. `npm run dev` está parado antes de `npm run test:e2e`.

### En qué consiste

Un fallo visible en la página, no en el estado. El caso lo nombra. La corrección se queda, y el caso también.

### 1 — Romper el filtro

**Dónde:** el `filter` de `visibles`, en `App.tsx` o donde viva.

**Qué haces:**

1. Quita `.toLowerCase()` del `texto`, solo de ese lado.
2. Guarda.
3. Lanza `npm run test:e2e`.

```tsx
return blob.includes(texto)
```

**Experimento:** el caso escribe `Este`. El blob está en minúsculas y `Este` lleva mayúscula, así que el inventario no aparece.

→ El caso falla. El mensaje nombra «Inventario de componentes». No habla de `useState`.

### 2 — Arreglar y conservar el caso

**Dónde:** la misma línea.

**Qué haces:**

1. Devuelve `texto.toLowerCase()`.
2. Lanza otra vez `npm run test:e2e`.
3. Deja el `it` en el archivo.

```tsx
return blob.includes(texto.toLowerCase())
```

**Experimento:** borra el `it` del filtro, deja el filtro roto y lanza el script.

→ Pasa el caso del título y nadie avisa del filtro. Restaura el `it` y el `toLowerCase()`. Los casos pasan.

**Validación:**

- `npm run test:e2e` termina en verde con el filtro arreglado y el caso presente.
- El caso del título sigue.
- `Este` en la caja, con `dev` otra vez, deja solo «Inventario de componentes».

### 3 — El checklist, en la misma bandeja

Con `npm run dev` en el 5173, recorre esto en el navegador. No es otro archivo.

| Qué miras | Qué se ve |
|-----------|-----------|
| `zzzz` en la caja | «Ningún entregable coincide.» |
| Pulsar la etiqueta «Buscar» | El foco entra en `#filtro` |
| Marcar E-101 | La pastilla pasa a `revisado` y el botón dice «Hecho» |
| Recargar | E-101 vuelve a pendiente si la lista nace de `datos.ts` o del JSON |

Si la lista ya viene de `/entregables.json`, abre Network y teclea: no se repite esa petición. Si todavía no hay petición, el checklist de red se salta: el caso del filtro no la necesita.

## Comprueba tu entendimiento

**Por qué se queda el caso**
Corrige el filtro y borra el `it`.
→ El siguiente cambio puede devolver el fallo y el script no lo ve. El caso se queda.

## Reto

### 1 — Un fallo que el caso no cubre

Deja el botón diciendo siempre «Anotar», aunque el estado sea `revisado`. Lanza el script.

<details>
<summary>Ver solución</summary>

Si no añadiste el caso de la pastilla, el script pasa. El fallo está en la página y el caso del filtro no lo mira. Restaura el texto «Hecho» cuando `item.estado === "revisado"`. El caso que lee `.estado` sí lo habría cazado.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| Sigue rojo después del arreglo | `dev` viejo, o el `toLowerCase` no volvió | Guarda, para el puerto y relanza `test:e2e` |
| El caso pasa con el filtro roto | El `it` escribe `este` en minúsculas | El caso escribe `Este`, con mayúscula |
| Borraste el caso al corregir | El `it` salió con el experimento | Vuelve a pegar el caso de M05-01 |
