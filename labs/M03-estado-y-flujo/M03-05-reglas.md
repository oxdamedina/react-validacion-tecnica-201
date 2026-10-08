# M03-05 — Las reglas

[← Página anterior](M03-04-useeffect.md) · [Siguiente página →](../M03-apis-y-arquitectura/README.md)

> Práctica de [useEffect y las reglas](../M02-estado-y-hooks/03-efecto.md).

### Objetivo

Provocar el fallo de un hook condicional, leerlo y dejar los hooks otra vez al principio de `App`.

### Código de partida

Hace falta el efecto del laboratorio anterior, no la cadena entera. Si la pestaña no dice «Pendientes: 3» al recargar, pega el código de partida de [M03-04](M03-04-useeffect.md) y añade el efecto de su paso 1. `useState` y `useEffect` quedan antes del `return`.

### En qué consiste

Se rompe el orden a propósito. No se deja roto. El experimento tiene dos sitios prohibidos: después de un `return` y dentro del `map`.

### 1 — Un hook debajo de un return

**Dónde:** `App.tsx`, justo antes del `return` que pinta la página.

**Qué haces:**

1. Añade el `if` y el estado.
2. Usa `extra` en ese return para que no quede sin usar.
3. Guarda.
4. Escribe en la caja despacio: `E`, `Es`, `Est`.

```tsx
if (texto.length > 2) {
  return <p>Demasiado texto {extra}</p>
}

const [extra, setExtra] = useState(0)
```

Si `setExtra` queda marcado como no usado, es parte del experimento. No lo tapes. En el paso 2 se borra entero.

**Experimento:** con una letra y con dos, la bandeja sigue. Con la tercera, la pantalla falla.

→ La consola dice que se renderizaron menos hooks que en el pintado anterior, o Problems ya marcó el hook después del `return`. Anota la frase. No sigas con la página rota.

**Validación de este paso:** has visto el fallo. La caja contiene al menos tres letras o la pantalla está en el mensaje de error. Eso se deshace ahora.

### 2 — Devolver el orden

**Dónde:** el mismo `App.tsx`.

**Qué haces:**

1. Borra el `if`.
2. Borra `extra` y `setExtra`.
3. Confirma que `texto`, `items` y el efecto siguen al inicio de la función, antes de cualquier `return`.
4. Guarda y recarga.

**Experimento:** dentro del `map`, antes del `<li>`, escribe `useState(item.id)`. Guarda.

→ Problems o la consola rechazan el hook: no puede estar en un callback. Borra esa línea.

**Validación:**

- Escribir `Este` deja el inventario, sin error de hooks en la consola.
- Al recargar, la pestaña vuelve a «Pendientes: 3».
- No queda `extra` ni un `useState` dentro del `map`.
- El número de hooks no depende de `texto.length`.

## Comprueba tu entendimiento

**Dónde están**
Recorre `App.tsx` de arriba abajo y cuenta llamadas que empiezan por `use`.
→ Todas están antes del `return`. Ninguna está dentro de un `if`.

## Reto

### 1 — El mismo fallo, más pequeño

Después del `return` principal no se puede añadir otro hook. Si quieres ver el aviso del editor sin romper la página, declara `useState` en la rama del `if (false)`.

<details>
<summary>Ver solución</summary>

El editor marca la regla aunque `false` nunca entre: los hooks no van en una rama. Borra esa línea. La página ni siquiera tiene que llegar a ejecutarla.

</details>

## Errores frecuentes

| Síntoma | Causa probable | Cómo arreglarlo |
|---------|----------------|-----------------|
| La página sigue rota | El `if (texto.length > 2)` sigue en el archivo | Bórralo en el paso 2 y recarga |
| `setExtra` no se usa | El estado de prueba sigue declarado | Borra `extra` al quitar el experimento |
| El filtro no vuelve | Borraste de más y `texto` ya no existe | `useState("")` del filtro sigue al principio |
