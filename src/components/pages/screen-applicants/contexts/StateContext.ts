import { createContext } from "react"
import { ContextTypes } from "../types"

const StateContext = createContext<ContextTypes | undefined>(undefined)

export default StateContext
 


