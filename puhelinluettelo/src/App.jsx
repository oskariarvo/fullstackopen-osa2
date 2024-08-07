import { useState, useEffect } from 'react'
import { findConfig } from 'browserslist';
import personService from "./services/persons"
import "./index.css"

const Header = ({text}) => <h2>{text}</h2>

const InputField = ({text, value, handleChange}) => {
  return (
    <div>
      {text}<input value={value} onChange={handleChange}/>
    </div>
  )}  

const Persons = ({namesToShow, handleClick}) => {
  return (
    <div>
      {namesToShow.map(person => {
          return (
              <div key={person.name}>{person.name} {person.number} <button onClick={() => handleClick(person.id, person.name)}>delete</button></div>
            )
        })}
    </div>
  )
}

const PersonForm = ({ addPerson, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <InputField text={"name:"} value={newName} handleChange={handleNameChange} />
      <InputField text={"number:"} value={newNumber} handleChange={handleNumberChange} />
      <button type="submit">add</button>
    </form>
  )
}

const Filter = ({newFilter, handleFilterChange}) => {
  return (
    <InputField text={"filter shown with"} value={newFilter} handleChange={handleFilterChange} />
  )
}

const Notification = ({ message, positive }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={positive}>
      {message}
    </div>
  )
}





const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [newFilter, setNewFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [positive, setPositive] = useState("positive")

  useEffect(() => {
    personService
      .getAll()
      .then(initialData => {
        console.log("responsedata:", initialData)
        setPersons(initialData)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    const nameList = persons.map(person => person.name)
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (nameList.includes(newName))
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) === true) {
        console.log("blingblong:", persons[nameList.indexOf(newName)].id)
        const id = persons[nameList.indexOf(newName)].id
        personService
          .change(id, personObject)
          .then(returnedPerson => {
            setPositive("positive")
            setMessage(`Changed ${newName} number from ${persons[nameList.indexOf(newName)].number} to ${returnedPerson.number}`)
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setNewName("")
            setNewNumber("")
            setTimeout(() => setMessage(null), 5000)
          })
          .catch(error => {
            setPositive("negative")
            setMessage(`Information of ${newName} has already been removed from the server`)
            setTimeout(() => setMessage(null), 5000)
            setPersons(persons.filter(p => p.id !== id))
          })
        return
      } else {
        return
      }
    personService
      .create(personObject)
      .then(newData => {
        console.log("addresponsedata:", newData)
        setPersons(persons.concat(newData))
        setNewName("")
        setNewNumber("")
        setPositive("positive")
        setMessage(`Added ${newData.name}`)
        setTimeout(() => setMessage(null), 5000)
      })
      .catch(error => {
        setPositive("negative")
        setMessage(`Error: could not add person`)
        setTimeout(() => setMessage(null), 5000)
        setPersons(persons.filter(p => p.id !== id))
      })
    console.log("Person list:", persons)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }
  const handleDeleteClick = (id, name) => {
    if (window.confirm(`Delete ${name}?`) === true) {
      personService
        .deleteObject(id)
        .then(() => {
          personService.getAll().then((initialData) => {
            setPositive("positive")
            setMessage(`Deleted ${name}`)
            setPersons(initialData)
            setTimeout(() => setMessage(null), 5000)
          })
        })
        .catch(error => {
          setPositive("negative")
          setMessage(`${name} has already been deleted from the server`)
          setTimeout(() => setMessage(null), 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
      }
  }
  const namesToShow = persons.filter (person => person.name.toLowerCase().startsWith(newFilter.toLowerCase()) === true)

  return (
    <div>
      <Header text={"Phonebook"} />
      <Notification message={message} positive={positive} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <Header text={"add a new"} />
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />

      <Header text={"Numbers"} />
      <Persons namesToShow={namesToShow} handleClick={handleDeleteClick} />
    </div>
  )

}

export default App