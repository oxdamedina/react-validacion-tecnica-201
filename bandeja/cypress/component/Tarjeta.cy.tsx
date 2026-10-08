import Tarjeta from "../../src/componentes/Tarjeta"
import type { Entregable } from "../../src/modelo"

const pendiente: Entregable = {
  id: "E-101",
  titulo: "Informe de accesibilidad",
  proveedor: "Norte",
  estado: "pendiente",
}

describe("Tarjeta", () => {
  it("pinta el pendiente y avisa al marcar", () => {
    cy.mount(
      <Tarjeta item={pendiente} alMarcar={cy.stub().as("marcar")} />,
    )
    cy.contains("Informe de accesibilidad")
    cy.contains("Falta revisión")
    cy.contains("button", "Anotar E-101").click()
    cy.get("@marcar").should("have.been.calledWith", "E-101")
  })
})
