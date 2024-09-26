// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(key, initialValue) {
  const [getValue, setValue] = React.useState(
    () => JSON.parse(window.localStorage.getItem(key)) || initialValue
  );

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(getValue));
  })

  return [
    getValue,
    setValue
  ];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name3', initialName);
  const [age, setAge] = useLocalStorageState('age', 3);

  function handleChange(event) {
    setName(event.target.value)
  }

  function handleAgeChange(event) {
    setAge(parseInt(event.target.value))
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
        <label htmlFor="age">Age: </label>
        <input type="number" value={age} onChange={handleAgeChange} id="age" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
