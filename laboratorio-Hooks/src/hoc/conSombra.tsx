import type { ComponentType } from "react"

interface OpcionesSombra {
  radio?: number
  padding?: number
  color?: string
}

export function conSombra<P extends object>(
  Componente: ComponentType<P>,
  { radio = 12, padding = 12, color = "rgba(0, 0, 0, 0.18)" }: OpcionesSombra = {},
) {
  function ConSombra(props: P) {
    return (
      <div
        style={{
          boxShadow: `0 8px 24px ${color}`,
          borderRadius: radio,
          padding,
          background: "white",
        }}
      >
        <Componente {...props} />
      </div>
    )
  }

  return ConSombra
}