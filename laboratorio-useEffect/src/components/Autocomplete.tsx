import { useState, useEffect } from 'react'

type Cocktail = {
  id: string
  name: string
}

const normalizarLista = (lista: Record<string, string>[] | undefined, prefijo: string) =>
  (lista ?? []).map((item, index) => ({
    id: `${prefijo}-${index}-${item.strCategory ?? item.strGlass ?? item.strIngredient1 ?? item.strIngredient ?? item.strAlcoholic ?? 'item'}`,
    name: item.strCategory ?? item.strGlass ?? item.strIngredient1 ?? item.strIngredient ?? item.strAlcoholic ?? 'Sin nombre'
  }))

const Autocomplete = () => {
  const [nombre, setNombre] = useState('')
  const [cocktails, setCocktails] = useState<Cocktail[]>([])

  const cargarListaInicial = () => {
    Promise.all([
      fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list'),
      fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list'),
      fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list'),
      fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list')
    ])
      .then((responses) => Promise.all(responses.map((resp) => resp.json())))
      .then(([categorias, vasos, ingredientes, alcohol]) => {
        const combinado = [
          ...normalizarLista(categorias?.drinks, 'categoria'),
          ...normalizarLista(vasos?.drinks, 'vaso'),
          ...normalizarLista(ingredientes?.drinks, 'ingrediente'),
          ...normalizarLista(alcohol?.drinks, 'alcohol')
        ]

        setCocktails(combinado)
      })
      .catch(() => setCocktails([]))
  }

  useEffect(() => {
    cargarListaInicial()
  }, [])

  useEffect(() => {
    if (nombre.trim().length <= 3) {
      cargarListaInicial()
      return
    }

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nombre}`)
      .then((resp) => resp.json())
      .then(({ drinks }) => {
        const resultados = (drinks ?? []).map((drink: Record<string, string>, index: number) => ({
          id: `buscar-${index}-${drink.idDrink ?? drink.strDrink ?? 'drink'}`,
          name: drink.strDrink ?? 'Sin nombre'
        }))

        setCocktails(resultados)
      })
      .catch(() => setCocktails([]))
  }, [nombre])

  const selectCocktail = (cocktailSeleccionado: Cocktail) => {
    setNombre(cocktailSeleccionado.name)
    setCocktails([])
  }

  return (
    <div style={{ maxWidth: '420px', margin: '24px auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Busca un cóctel..."
          style={{
            width: '100%',
            padding: '12px 42px 12px 14px',
            fontSize: '16px',
            border: '1px solid #d1d5db',
            borderRadius: '10px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        {nombre && (
          <button
            type="button"
            onClick={() => setNombre('')}
            aria-label="Borrar texto"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              fontSize: '20px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: 0
            }}
          >
            ×
          </button>
        )}
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
        }}
      >
        {cocktails.map((c) => (
          <li
            key={c.id}
            onClick={() => selectCocktail(c)}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #f3f4f6',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              backgroundColor: '#ffffff',
              color: '#1f2937',
              fontSize: '15px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff'
            }}
          >
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Autocomplete