import { useState, useEffect } from 'react'
import axios from "axios"

const ShowData = ({ filteredCountries, specificCountry, handleClick, weather}) => {
  if (specificCountry !== null) {
    return (
      <div>
        <h1>{specificCountry.name.common}</h1>
        <div>capital {specificCountry.capital}</div>
        <div>area {specificCountry.area}</div>
        <h3>languages:</h3>
        <ul>
          {Object.values(specificCountry.languages).map((langu) => {
            return <li key={langu}>{langu}</li>
          })}
        </ul>
        <img src={specificCountry.flags.png} alt={specificCountry.flags.alt} />
        {weather && (
          <div>
            <h2>Weather in {specificCountry.capital}</h2>
            <p>temperature {weather.main.temp} Celcius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
            <p>wind {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    )
  } else if (filteredCountries.length <= 10 && filteredCountries.length > 1) {
    return (
      <div>
        {filteredCountries.map((country) => {
          return (
            <div key={country.cca3}>
              {country.name.common}<button onClick={() => handleClick(country.name.common)}>show</button>
            </div>
          )
        })}
      </div>
    )
  } else if (filteredCountries.length > 10){
    return <div>Too many matches, specify another filter</div>
  } else if (filteredCountries.length < 1) {
    return 
  } else {
    return <div>please wait</div>
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryInput, setCountryInput] = useState("")
  const [weather, setWeather] = useState(null)
  const [specificCountry, setSpecificCountry] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY


  useEffect(() => {
    console.log("preset")
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const filteredCountries = countries.filter(country => {
    return country.name.common.toLowerCase().includes(countryInput.toLowerCase())
  })

  const handleClick = (country) => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then(response => {
        console.log(response.data)
        setSpecificCountry(response.data)
        fetchWeather(response.data.capital)
      })
  }
  const fetchWeather = (capital) => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
      .then(response => {
        console.log(response.data)
        setWeather(response.data)
    })
  }

  const handleChange = (event) => {
    setCountryInput(event.target.value)
  }

  useEffect(() => {
    if (filteredCountries.length === 1) {
      handleClick(filteredCountries[0].name.common)
    } else {
      setSpecificCountry(null)
      setWeather(null)
    }
  }, [countryInput])


  return (
    <div>
      <div>
        find countries <input value={countryInput} onChange={handleChange} />
      </div>
      <div>
        <ShowData filteredCountries={filteredCountries} specificCountry={specificCountry} handleClick={handleClick} weather={weather} />
      </div>
    </div>
  )
}

export default App
