# Práctica — Props, lista y evento

> El recorrido del curso está en la [home, por jornadas](../../README.md). Esta carpeta queda fuera de esa guía.


> Práctica de [props](../M01-fundamentos/03-props.md) y [eventos](../M01-fundamentos/04-eventos.md). Sigue siendo el módulo 1. El módulo 2 del curso es [estado](../M02-estado-y-hooks/README.md), y su práctica está en `labs/M03-estado-y-flujo/`.

`Tarjeta` es `bandeja/src/componentes/Tarjeta.tsx`. Lo crea [M01-03](../M01-tsx-y-componente/M01-03-componente.md). Al empezar esta práctica el objeto `entrega` está escrito dentro de ese archivo y `App` solo pone `<Tarjeta />`.

[← Página anterior](../M01-fundamentos/03-props.md) · [Siguiente página →](M02-01-props.md)

> [!NOTE]
> Se sigue en la misma `Tarjeta`. Cada laboratorio añade una prop, una condición, la lista o el clic.

## Qué aprenderás

- Recibir el entregable por props, con interfaz.
- Pintar solo a veces, y pintar una lista con `key`.
- Responder a un clic con una función tipada.

## Teoría

La prop entra como argumento. Quien usa el componente decide el valor. La tarjeta no importa la lista.

| Idea | Señal de que está hecha |
|------|-------------------------|
| Prop | `<Tarjeta />` sin `item` no compila |
| Condición | Una frase aparece solo si el estado es `pendiente` |
| Lista | Seis fichas, cada `key` es `item.id` |
| Evento | El clic escribe el id en la consola, no al cargar |

## Demostración guiada

El guion está en [Props](../M01-fundamentos/03-props.md) y [Eventos](../M01-fundamentos/04-eventos.md). Los laboratorios lo cortan así.

Punto de partida: una ficha, «Informe de accesibilidad», pastilla `pendiente`. El objeto está en `Tarjeta.tsx`, no en `App`.

1. [M02-01](M02-01-props.md). `Tarjeta` pasa a recibir `item: Entregable`. Sin pasarlo, Problems marca `<Tarjeta />` en `App.tsx`. Con `<Tarjeta item={entrega} />` y el objeto otra vez en `App`, la ficha sigue igual y en `Tarjeta.tsx` ya no queda el nombre `entrega`.
2. [M02-02](M02-02-defecto.md). Sin `textoBoton`, el botón dice «Anotar E-101». Con `textoBoton="Registrar"`, solo cambia esa palabra.
3. [M02-03](M02-03-condicional.md). «Falta revisión» se ve con `pendiente` y desaparece con `revisado`.
4. [M02-04](M02-04-lista.md). `bandeja/src/datos.ts` con E-101 … E-106. El `map` pinta seis. `key` es `item.id` en el `<li>`. «Falta revisión» en E-101, E-103 y E-105. `"listo"` en E-104 lo marca Problems en `datos.ts`.
5. [M02-05](M02-05-evento.md). Consola vacía al cargar. «Anotar E-104» escribe `E-104`. `onClick={anotar(item.id)}` escribe los seis id al pintar. Se deja `() => anotar(item.id)`. La pastilla de E-104 sigue en `rechazado`.

Dónde queda: seis fichas y el clic en la consola. La práctica de estado, carpeta `M03-estado-y-flujo`, parte de aquí.

## Ahora practica tú

| Lab | Título | Qué harás |
|-----|--------|-----------|
| M02-01 | [La prop](M02-01-props.md) | Pasar `item` con interfaz |
| M02-02 | [El valor por defecto](M02-02-defecto.md) | Un texto de botón opcional |
| M02-03 | [La condición](M02-03-condicional.md) | Una frase solo si falta revisión |
| M02-04 | [La lista](M02-04-lista.md) | `map` y `key` |
| M02-05 | [El evento](M02-05-evento.md) | `onClick` tipado |

→ Empieza por **[M02-01 — La prop](M02-01-props.md)**.
