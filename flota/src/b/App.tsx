import { Menu } from "../comun/Menu"
import { Lista } from "./Lista"
import { Control } from "./Control"
import "../comun/estilos.css"

export default function App() {
  return (
    <div className="marco">
      <Control />
      <Menu />
      <main className="panel">
        <Lista />
      </main>
    </div>
  )
}
