// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [status, setStatus] = React.useState({status: 'idle', pokemon: null});
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if ('' === pokemonName) {
      return;
    }

    setStatus({status: 'pending', pokemon: null});

    fetchPokemon(pokemonName)
      .then(
        pokemonData => {
          setStatus({status: 'pending', pokemon: pokemonData});
        }
      )
      .catch(
        error => {
          setError(error)
          setStatus({status: 'rejected', pokemon: null});
        }
      );

  }, [pokemonName]);

  if ('idle' === status.status) {
    return 'Submit a pokemon';
  }

  if ('pending' === status.status) {
    return <PokemonInfoFallback name={pokemonName} />;
  }

  if ('rejected' === status.status) {
    return (
      <div role="alert">
        There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      </div>
    );
  }

  if ('resolved' === status.status) {
    return <PokemonDataView pokemon={status.pokemon} />;
  }
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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
