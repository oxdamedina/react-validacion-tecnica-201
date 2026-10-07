interface PropsEjemplo {
    cantidad: number;
}

interface Payload {
  action: string;
  props: PropsEjemplo;
}

// estado: que afecta a ejemploReductor
// payload: Interface que describe la forma de los datos que se envían al reductor
const ejemploReductor = (estado: any, payload: Payload) => {
    // Los reducers deben ser funciones puras, es decir, que sea idenpotenciales haciendo que el mismo input siempre genere
    // el mismo output y por ende sin modificar los parámetros de entradas.
    console.log(estado, payload)

    // Esta función siempre tiene que devolver un nuevo valor del estado
    // independientemente de como esté construida
    switch (payload.action) {
        case "incrementar": return { ...estado, contador: estado.contador + payload.props.cantidad }
        case "decrementar": return { ...estado, contador: estado.contador - payload.props.cantidad }
        default: return estado;
    }
}

export default ejemploReductor