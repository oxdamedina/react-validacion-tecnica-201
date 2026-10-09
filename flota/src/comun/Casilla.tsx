import type { ReactNode } from "react"
import { useMarca } from "./marca"

export function Casilla({
  children,
  campo,
}: {
  children: ReactNode
  campo?: string
}) {
  const { clase, renders } = useMarca()
  return (
    <div className={`celda ${clase}`} data-renders={renders} data-campo={campo}>
      {children}
    </div>
  )
}
