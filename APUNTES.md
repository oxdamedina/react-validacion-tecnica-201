# Formación ReactJS Avanzado

## Documentación de la formación

- [Guía Formación](https://tmbbcn.sharepoint.com/:b:/s/TN-SOB/IQDgtoQ-UVbOQ4KCeMcq20a9ARoOYabZOeYa2-MGp4MlVpU)
- [Documentación React tsx](https://github.com/davidpestana/react-tsx-full/blob/master/19-01-lab-flujo-datos.md)

## Intro

- `ReactJS` es una librería y se puede utilizar en cualquier proyecto
- Esta librería se mete dentro de "_algo_" que te ayuda a construir una **SPA**, **WPA**,...
- `ReactJS` sólo te indica como conectar las piezas
- El "_algo_" dónde montaremos `ReactJS` será `vite`, ya que lo recomienda `ReactJS`
- Al utilizar `vite` hay cierto elementos que se utilzian por inferencia

> [IMPORTANT]
> `ReactJS` no es un _framework_. Es una metodología de desarrollo.
> `AngularJS` **SÍ** es un _framework_

## Manejo aplicación

- A partir de [JavaScript](https://compat-table.github.io/compat-table/es6/) **6** cambio internet, permitiendo la ejecución de código (un programa) sin necesitar un navegador:
- Para el ejemplo, creamos un archivo `index.js` le damos el código y lo ejecutamos con `node`

```bash
nano index.js
```

```javscript
console.log("hola mundo")
```

```bash
$ node index.js
hola mundo
```

- Herramienta para la creación de entronos de desarrollo [vite](https://vite.dev/)
- `npm` es un gestor de paquetes pero está abuelete. `pnpm`, `yam`, `bum` son las nuevas opciones más modernas

### Creación aplicación con el constructor `vite`

Para constuir el "taller" de desarrollo:

```bash
npm create vite@latest miapp
```

El proceso solicitar responder varias preguntar para crear el taller:

- Framework? `ReactJS`
- Variant? `TypeScript`
- Lintern? `ESLint`
- Install `npm`? `Yes`

Tras responder las preguntas se iniciar la instalación y se crea el entorno.

`JavaScript` es un lenguaje de programación basado en _scripts_, el cual está _mal parido_ desde el punto de vista que no protege al programador de su propia estupidez (_spaguetti async_)
`TypeScript` es un lenguaje altamente tipado que protege al programador de su propia estupidez y por ende se ha convertido en el sustituto moderno de `JavaScript`
Para que `typescript` pueda ejecutarse, necesita un proceso de transpilación para mutar de `TypeScript` a `JavaScript`. La parte buena es que al programar en ReactJS, que ya es un lenguaje de alto nivel, trabajamos directamtne con `TSX` en lugar de `JSX`y evitamos la traspilación.

### Ejecución aplicación

Con la aplicación creada, basta con entrar dentro de la carpeta de la aplicación y ejecutar el entrono:

```bash
cd miapp
npm run dev
```

Con la aplicación abierta, `ReactJS`, al trabajar con _sockets_, permite que modifiquemos componentes de la vista (como por ejemplo dentro del archivo `App.tsx`) y al guardar los cambios se actualicen directamente

### Compilación aplicación

Con la ejecución del comando `npm run build` se crea la carpeta `assets` dentro de la carpeta de la aplicación dónde se almacenará el compilado de la misma.
Si prestamos atención en el proceso, al ejecutar el comando primero se realiza la traspilación mediante `tsc -b` y posteriormente crea la aplicación `vite build`

## Creación clase

Dentro del proyecto `mi-app` creamos la carpeta **ejemplo-clase** y dentro de la carpeta creamos el archivo `ComponenteClase.tsx`
Se debe tener en cuenta que la convención es _camel case_ para todos los documentados

> [!NOTE]
> El componente clase se elimina por la gente de ReactJS

Un componente funcional es un componente en el que la función devuelve código `jsx`
La gente de `ReactJS` elimina el componente **clase** ya que contruirla, instanciarla,... consume mucha memoria. En su lugar se dectanta por el uso de componentes funcionales, como sería el caso de `/ejemplo-clase/Contador.tsx`

### Arrow function

La convención `() => "algo"` viene a sustituir al código:

```javascript
function soyFuncion(){
    return "algo"
}
```

Con la idea de minimzar al máximo el consumo de memoria

### Paréntesis en `return`

Viene heredado de `jsx`
Se utilzia exclusivamente para excribir multi línea

## Componente Contenedor

El archivo suele tener esta composición `Cliente.contenedor.tsx`
Es un componente que no envía ni recibe (no tiene _props_) ningún parámetro, además, no renderiza nada.
Su única función es llamar a un componente vista que se llama de una forma concreta.

## Conceptos

`props drilling`:

## Hooks

Técnica que introduce `ReactJS` cuando en lugar de utilziar clases, se utilizan funciones y por ende no existenten las hernecias.
Las propiedades se incroporan a través de `Hooks`
Los `Hooks` son funciones que se incluyen en un componente
