/*
    Colección de acciones que se pueden llevar a cabo en el reducer
*/
export const incrementar = (cantidad: number) => ({ action:"incrementar", props: { cantidad } })
export const decrementar = (cantidad: number) => ({ action:"decrementar", props: { cantidad } })