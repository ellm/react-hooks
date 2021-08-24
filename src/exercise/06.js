// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary';

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

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Reset</button>
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
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={[pokemonName]}
          onReset={() => {
            setPokemonName('');
          }}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
