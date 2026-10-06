import { useState, useEffect } from "react"

const SearchBox = ({onSearch}) => {
    const [text, setText] = useState("Qué estás buscando?")

    // Detecta cambios en el estado de text y ejecuta la función onSearch cada vez que cambia.
    // Del estado anterior, al estado nuevo, sólo cuando cambia el estado text se ejecuta
    // la función que se le pasa como callback.
    useEffect(() => {
        const timeout = setTimeout(() => onSearch(text), 300)

        // Limpia el timeout cuando el componente se desmonta o cuando cambia el estado de text
        return () => {clearInterval(timeout)}
    }, [text, onSearch])

    return <input value={text} onChange={(event) =>setText(event.target.value)} />
}

export default SearchBox

/* class algo extends Component {
    // implementación de los métodos del ciclo de vida de una clase
    willMount() { //Lo que se ejecuta antes de montar el componente }
    willUnmount() { //Lo que se ejecuta antes de desmontar el componente }
    willUpdate() { //Lo que se ejecuta antes de actualizar el componente}
    willReceiveProps() { //Lo que se ejecuta antes de recibir nuevas props}
    ...
} */