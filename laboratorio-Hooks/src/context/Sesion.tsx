import { createContext, useContext, useState, type ReactNode } from "react"

interface Sesion {
  revisor: string
  setRevisor: (nombre: string) => void
}

const SesionContexto = createContext<Sesion | null>(null)

export function SesionProveedor({ children }: { children: ReactNode }) {
  const [revisor, setRevisor] = useState("Ana")

  return (
    <SesionContexto.Provider value={{ revisor, setRevisor }}>
      {children}
    </SesionContexto.Provider>
  )
}

export function useSesion(): Sesion {
  const sesion = useContext(SesionContexto)

  if (!sesion) throw new Error("useSesion fuera del proveedor")

  return sesion
}