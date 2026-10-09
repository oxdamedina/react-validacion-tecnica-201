# React para validación técnica, testing y rendimiento

[Siguiente página →](labs/J01-fundamentos/README.md)

La aplicación de la semana es la [bandeja de entregables](bandeja/README.md), en Vite y TypeScript. El entorno es el dev container del repositorio. En GitHub: **Code → Create codespace on main**. Dentro de `bandeja/`, `npm run dev` abre el puerto **5173**. `npm run build` comprueba los tipos y empaqueta.

Componentes funcionales, ficheros `.tsx`, interfaces propias. Sin `any` y sin clases.

Cada punto es una página con dos ejercicios distintos. La demostración se sigue tal cual, con su código de partida. El laboratorio pide otra cosa con la misma idea: no repite la demostración. El README de la jornada es solo el índice.

## Jornada 1 — Fundamentos de React

Objetivo: construir la base desde cero. Índice: [jornada 1](labs/J01-fundamentos/README.md).

- [Introducción a React](labs/J01-fundamentos/J01-01-react.md)
- [SPA y aplicación tradicional](labs/J01-fundamentos/J01-02-spa.md)
- [Entorno: Node, npm y Vite](labs/J01-fundamentos/J01-03-entorno.md)
- [JSX](labs/J01-fundamentos/J01-04-jsx.md)
- [Componentes](labs/J01-fundamentos/J01-05-componentes.md)
- [Props](labs/J01-fundamentos/J01-06-props.md)
- [Eventos](labs/J01-fundamentos/J01-07-eventos.md)

Laboratorios:

- Setup del entorno — [J01-03](labs/J01-fundamentos/J01-03-entorno.md)
- Primera aplicación — [J01-01](labs/J01-fundamentos/J01-01-react.md)
- Componentes reutilizables — [J01-05](labs/J01-fundamentos/J01-05-componentes.md)

## Jornada 2 — Estado, hooks y flujo de datos

Objetivo: entender el comportamiento de la aplicación. Índice: [jornada 2](labs/J02-estado/README.md).

- [State](labs/J02-estado/J02-01-state.md)
- [useState](labs/J02-estado/J02-02-usestate.md)
- [useEffect](labs/J02-estado/J02-03-useeffect.md)
- [Ciclo de vida](labs/J02-estado/J02-04-ciclo.md)
- [Flujo de datos](labs/J02-estado/J02-05-flujo.md)
- [Separación lógica / presentación](labs/J02-estado/J02-06-separacion.md)

Laboratorios:

- Aplicación con estado — [J02-02](labs/J02-estado/J02-02-usestate.md)
- Efectos — [J02-03](labs/J02-estado/J02-03-useeffect.md)
- Comportamiento de la interfaz — [J02-05](labs/J02-estado/J02-05-flujo.md)

## Jornada 3 — Integración, arquitectura y buenas prácticas

Objetivo: trabajar con datos reales y evaluar la estructura. Índice: [jornada 3](labs/J03-integracion/README.md).

- [useContext](labs/J03-integracion/J03-01-contexto.md)
- [HOC](labs/J03-integracion/J03-02-hoc.md)
- [Memo y useMemo](labs/J03-integracion/J03-03-memo.md)
- [useReducer](labs/J03-integracion/J03-04-reducer.md)
- [useStore](labs/J03-integracion/J03-05-store.md)
- [Ciclo: reducer, store y API](labs/J03-integracion/J03-06-ciclo.md)
- [Consumo de API](labs/J03-integracion/J03-07-fetch.md)
- [Loading, error y vacío](labs/J03-integracion/J03-08-finales.md)
- [Estructura del proyecto](labs/J03-integracion/J03-09-estructura.md)
- [Separación de responsabilidades](labs/J03-integracion/J03-10-responsabilidades.md)
- [Componente reutilizable](labs/J03-integracion/J03-11-reutilizable.md)
- [Antipatrones](labs/J03-integracion/J03-12-antipatrones.md)

Laboratorios:

- HOC — [J03-02](labs/J03-integracion/J03-02-hoc.md)
- useMemo — [J03-03](labs/J03-integracion/J03-03-memo.md)
- useReducer — [J03-04](labs/J03-integracion/J03-04-reducer.md)
- useStore — [J03-05](labs/J03-integracion/J03-05-store.md)
- Ciclo reducer, store y API — [J03-06](labs/J03-integracion/J03-06-ciclo.md)
- Consumo de API — [J03-07](labs/J03-integracion/J03-07-fetch.md)
- Refactor de la estructura — [J03-09](labs/J03-integracion/J03-09-estructura.md)
- Arquitectura — [J03-10](labs/J03-integracion/J03-10-responsabilidades.md)

## Jornada 4 — Rendimiento y herramientas de análisis

Objetivo: detectar problemas de rendimiento. Índice: [jornada 4](labs/J04-rendimiento/README.md).

- [Qué impacta en el rendimiento](labs/J04-rendimiento/J04-01-impacto.md)
- [Re-renderizados](labs/J04-rendimiento/J04-02-rerender.md)
- [Estado y referencias](labs/J04-rendimiento/J04-03-estado.md)
- [Lazy loading y code splitting](labs/J04-rendimiento/J04-04-lazy.md)

Herramientas:

- [Chrome DevTools](labs/J04-rendimiento/J04-05-devtools.md)
- [React Profiler](labs/J04-rendimiento/J04-06-profiler.md)
- [Lighthouse](labs/J04-rendimiento/J04-07-lighthouse.md)

Laboratorios:

- Medición — [J04-01](labs/J04-rendimiento/J04-01-impacto.md)
- Cuellos de botella — [J04-06](labs/J04-rendimiento/J04-06-profiler.md)
- Optimización — [J04-03](labs/J04-rendimiento/J04-03-estado.md)
- Auditoría — [J04-07](labs/J04-rendimiento/J04-07-lighthouse.md)

## Jornada 5 — Testing, validación y mejora

Objetivo: validar un entregable y corregir lo que falle. Índice: [jornada 5](labs/J05-testing/README.md).

- [Estrategia de testing](labs/J05-testing/J05-01-estrategia.md)
- [Testing en React](labs/J05-testing/J05-02-vision.md)
- [Cypress](labs/J05-testing/J05-03-cypress.md)
- [Test de componente](labs/J05-testing/J05-07-componente.md)
- [Validar un entregable](labs/J05-testing/J05-04-entregable.md)
- [Checklist](labs/J05-testing/J05-05-checklist.md)
- [Riesgos](labs/J05-testing/J05-06-riesgos.md)

Laboratorios:

- Tests E2E — [J05-03](labs/J05-testing/J05-03-cypress.md)
- Test de componente — [J05-07](labs/J05-testing/J05-07-componente.md)
- Validación de un flujo — [J05-04](labs/J05-testing/J05-04-entregable.md)
- Checklist — [J05-05](labs/J05-testing/J05-05-checklist.md)
- Corrección — [J05-06](labs/J05-testing/J05-06-riesgos.md)

## Jornada 6 — Estudiar y reportar el rendimiento

Objetivo: saber qué hace cada herramienta, cómo se usa y para qué sirve el dato. La app se mira con el entorno de desarrollo. Las páginas van clic a clic, con capturas de la bandeja en marcha. Índice: [jornada 6](labs/J06-informe/README.md).

- [Qué herramienta](labs/J06-informe/J06-01-mapa.md)
- [Chrome DevTools](labs/J06-informe/J06-02-devtools.md)
- [React DevTools](labs/J06-informe/J06-03-react.md)
- [Lighthouse](labs/J06-informe/J06-04-lighthouse.md)
- [El informe](labs/J06-informe/J06-05-informe.md)

Sin demo ni laboratorio. El cierre es saber qué contarle al autor.

## Flota — contraste de render

Dos apps con la misma tabla de mil autobuses. La A actualiza el estado en la raíz y repinta el árbol. La B avisa solo a la celda del pulso. Índice: [flota](flota/README.md).

→ Empieza por **[Jornada 1 — Fundamentos de React](labs/J01-fundamentos/README.md)**.
