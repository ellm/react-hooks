// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView
} from '../pokemon'

class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    const { error } = this.state
    if (error) {
      return <this.props.FallbackComponent error={error} />
    }

    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null
  });
  const { status, pokemon, error } = state

  React.useEffect(() => {
    if ('' === pokemonName) {
      return;
    }

    setState({status: 'pending'});

    fetchPokemon(pokemonName)
      .then(
        pokemonData => {
          setState({ status: 'resolved', pokemon: pokemonData});
        },
        error => {
          setState({ status: 'rejected', error })
        },
      );

  }, [pokemonName]);

  if ('idle' === status) {
    return 'Submit a pokemon';
  }

  if ('pending' === status) {
    return <PokemonInfoFallback name={pokemonName} />;
  }

  if ('rejected' === status) {
    throw error
  }

  if ('resolved' === status) {
    return <PokemonDataView pokemon={pokemon} />;
  }

  throw new Error('This should be impossible')
}

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
