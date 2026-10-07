import { useState, useContext } from "react";
import ValorGeneral from "../ValorGeneralContext.jsx";

const Level2 = () => {
    const [valor, setValor] = useState(0);
    const valorGeneral = useContext(ValorGeneral);
    console.log("Valor general: ", valorGeneral);

    valorGeneral = 1;

    return <>
        Componente Level 2
        <button onClick={() => setValor(valor + 1)}>Incrementar</button>
    </>
}

export default Level2;