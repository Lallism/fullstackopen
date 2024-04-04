import { useState, useEffect } from 'react'
import axios from 'axios'
import SearchResult from "./components/SearchResult"

const App = () => {
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState({})
  const [search, setSearch] = useState("")

  const api_key = import.meta.env.VITE_SOME_KEY

  const shownCountries = countries.filter((country) => country.name.common.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (shownCountries.length === 1) {
      let capital = shownCountries[0].capital
      axios
        .get(`https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${capital}&aqi=no`)
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [search])

  const showCountry = (name) => {
    setSearch(name)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  return (
    <>
      <div>
        find countries
        <input value={search} onChange={handleSearch} />
      </div>
      <SearchResult shownCountries={shownCountries} weather={weather} showCountry={showCountry}/>
    </>
  )
}

export default App
