import type { ComponentType } from "react"
import { useSesion } from "../context/Sesion"

export function conRevisor<P extends { revisor: string }>(
  Componente: ComponentType<P>,
) {
  function Envuelto(props: Omit<P, "revisor">) {
    const { revisor } = useSesion()
    const completas = { ...props, revisor } as P

    return <Componente {...completas} />
  }

  return Envuelto
}