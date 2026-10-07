import { useReducer, useState } from "react"
import ejemploReductor from "../reducers/ejemplo.reducer"
import { incrementar } from "../acciones/ejemplo.action.tsx"

const Ejemplo = () => {
    const [{contador}, mensajero] = useReducer(ejemploReductor, {contador: 0, otracosa: 'algo'})
    const [cantidad, setCantidad] = useState(1)

    return <>
        <h1>{contador}</h1>
        <button onClick={() => setCantidad(cantidad + 1)}>+</button>
        <h3>{cantidad}</h3>
        <button onClick={() => setCantidad(cantidad - 1)}>-</button>
        <button onClick={() => mensajero(incrementar(cantidad))}>Incrementar</button>
        {/* <button onClick={() => mensajero({action:'incrementar', props: {cantidad}})}>Incrementar</button> */}
        <button onClick={() => mensajero({action:'decrementar', props: {cantidad}})}>Decrementar</button>
    </>
}

export default Ejemplo