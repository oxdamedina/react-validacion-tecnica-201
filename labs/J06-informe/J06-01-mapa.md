# J06-01 — Qué herramienta

[← Página anterior](README.md) · [Siguiente página →](J06-02-devtools.md)

La bandeja se abre con `npm run dev`, en `http://127.0.0.1:5173`, y ahí se queda. Estas páginas no cambian `bandeja/src`. Dicen qué panel existe, cómo se abre y qué dato deja para contárselo a quien escribe el código. Las capturas de las páginas siguientes están hechas sobre esa URL.

Hay tres herramientas. Se miran todas con el entorno de desarrollo. No todas sirven igual si solo te pasan la página ya publicada, sin el fuente y sin Vite.

1. **Chrome DevTools** viene con el navegador. F12. Para el rendimiento se usan dos pestañas: **Red** y **Rendimiento**. Las dos abren tanto en el dev como en una URL publicada. En el dev, Red enseña un módulo por archivo (`Tarjeta.tsx`). En la página publicada, enseña el HTML y los archivos del paquete, con el nombre que tenga ese sitio. Rendimiento graba igual en los dos casos. Cambia el nombre del script, no el modo de grabar. El detalle, clic a clic, está en [Chrome DevTools](J06-02-devtools.md).
2. **React DevTools** es una extensión. Añade **Components** y **Profiler**. Sirven con el entorno de desarrollo, porque React va en build de desarrollo y el árbol conserva `App` y `Tarjeta`. Si solo tienes la página publicada, el Profiler no graba: ese build es de producción. Desde ahí no puedes decir qué componente se ejecutó. El detalle está en [React DevTools](J06-03-react.md).
3. **Lighthouse** también viene con el navegador, dentro de F12. Mide la carga de la URL que esté abierta, sea el dev o una página publicada. El número es de esa URL. El de `127.0.0.1` con `npm run dev` no es el de un sitio ya publicado: el dev manda un módulo por archivo. El detalle está en [Lighthouse](J06-04-lighthouse.md).

El informe nombra la herramienta y el gesto. Si el dato solo existe con el entorno de desarrollo, la frase lo dice. El autor sabe entonces qué podría repetir abriendo solo la página y qué necesita el fuente. Cómo se redacta cada frase está en [El informe](J06-05-informe.md).
