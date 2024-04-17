import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({message, className}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const Filter = ({search, setSearch}) => <div>filter: <input value={search} onChange={event => setSearch(event.target.value)}/></div>

const PersonForm = ({addName, newName, newNumber, setNewName, setNewNumber}) => (
  <form onSubmit={addName}>
    <div>name: <input value={newName} onChange={(event) => setNewName(event.target.value)}/></div>
    <div>number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/></div>
    <div><button type="submit">add</button></div>
  </form>
)

const Person = ({name, number, deletePerson, id}) => (
  <div>
    {name} {number}
    <button onClick={deletePerson}>delete</button>
  </div>
)

const Persons = ({shownPersons, deletePerson}) => <div>{shownPersons.map((person) => <Person key={person.name} name={person.name} number={person.number} deletePerson={() => deletePerson(person.name, person.id)} />)}</div>

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const shownPersons = persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const notification = (message) => {
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
  }

  const errorMessage = (message) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const addName = (event) => {
    event.preventDefault()
    const personObject = {name: newName, number: newNumber}
    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already in the phonebook, replace old number with the new one?`)) {
        updatePerson(existingPerson, personObject)
      }
      return
    }

    personService.create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        notification(`Added ${returnedPerson.name}`)
      })
      .catch(error => {
        errorMessage(error.response.data.error)
      })
  }

  const updatePerson = (existingPerson, personObject) => {
    personService
      .update(existingPerson.id, personObject)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
        notification(`Updated ${newName}`)
      })
      .catch(() => {
        setPersons(persons.filter((person) => person.name !== newName))
        errorMessage(`Information of ${newName} has been already removed from server`)
      })
  }

  const deletePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      setPersons(persons.filter((person) => person.name !== name))
      personService.remove(id)
      notification(`Deleted ${name}`)
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} className={"notification"}/>
      <Notification message={error} className={"error"}/>
      <Filter search={search} setSearch={setSearch} />
      <h2>Add new</h2>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber}/>
      <h2>Numbers</h2>
      <Persons shownPersons={shownPersons} deletePerson={deletePerson}/>
    </div>
  )

}

export default App
