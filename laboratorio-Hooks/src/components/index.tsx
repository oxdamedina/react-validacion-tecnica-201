import { conRevisor } from "../hoc/conRevisor";
import { default as TarjetaSinRevisor } from "./Tarjeta";
export const Tarjeta = conRevisor(TarjetaSinRevisor);