import { useRef } from "react"

export function useMarca(): { clase: string; renders: number } {
  const n = useRef(0)
  n.current += 1
  const clase = n.current <= 1 ? "" : n.current % 2 === 0 ? "marca-a" : "marca-b"
  return { clase, renders: n.current }
}
