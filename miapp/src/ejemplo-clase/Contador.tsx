// Tipo 1
//const Contador = () => <>I'm the render!</>

// Tipo 2
//const Contador = () => {
//    console.log("Pasa por el render del componente funcional");
//    return <>I'm the render!</>
//}

import { useState } from "react";

interface ContadorProps {
    titulo: string;
    valorInicial?: number;
}

const Contador = ({titulo, valorInicial}: ContadorProps) => {
    const [contador, setContador] = useState<number>(valorInicial || 0)

    console.log("Pasa por el render del componente funcional");

    return (
        <div>
            <h2>{titulo}</h2>
            <p>Contador: {contador}</p>
            <button onClick={() => setContador(contador + 1)}>Sumar</button>
            <button onClick={() => setContador(contador - 1)}>Restar</button>
        </div>
    )
}

export default Contador