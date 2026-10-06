import { useState } from 'react'
import './App.css'
import ProductList from './components/PorductList'
import SearchBox from './components/SearchBox'

const data=[
              {name: "camera", price: 12},
              {name: "teclado", price: 10},
              {name: "raton", price: 8},
              {name: "monitor", price: 150},
              {name: "impresora", price: 95},
              {name: "altavoces", price: 25},
              {name: "microfono", price: 35},
              {name: "webcam", price: 22},
              {name: "portatil", price: 750},
              {name: "tablet", price: 220},
              {name: "smartphone", price: 450},
              {name: "disco duro", price: 65},
              {name: "ssd", price: 80},
              {name: "memoria usb", price: 15},
              {name: "router", price: 55},
              {name: "switch", price: 40},
              {name: "auriculares", price: 30},
              {name: "proyector", price: 280},
              {name: "escaner", price: 110},
              {name: "sai", price: 120}
            ]

function App() {
  const [productos, setProductos] = useState(data)
  const [mostrar, setMostrar] = useState(true)

  return (
    <>
      <SearchBox onSearch={(text) => setProductos(data.filter((product) => product.name.toLowerCase().includes(text.toLowerCase())))}></SearchBox>
      {mostrar ? <p>PC Compoñentes</p> : <p>Es PC Componentes Gili Monguer!</p>}
      <button onClick={() => setMostrar(!mostrar)}>Mostrar/Ocultar</button>
      <ProductList products={productos} />
    </>
  )
}

export default App
