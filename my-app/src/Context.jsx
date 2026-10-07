import { useState } from "react";
import Level1 from "./components/Level1.jsx";
import ValorGeneral from "./ValorGeneralContext.jsx";

const Context = () => {
    const [valorGeneral, setValorGeneral] = useState(0);

    return (
        <ValorGeneral.Provider value={[valorGeneral, setValorGeneral]}>
            <Level1/>
        </ValorGeneral.Provider>
    )
}

export default Context