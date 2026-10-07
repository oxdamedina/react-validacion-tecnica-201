import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Context from './Context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Context />
  </StrictMode>,
)
