export type EstadoEntregable = "pendiente" | "revisado" | "rechazado"

export interface Entregable {
  id: string
  titulo: string
  proveedor: string
  estado: EstadoEntregable
}
