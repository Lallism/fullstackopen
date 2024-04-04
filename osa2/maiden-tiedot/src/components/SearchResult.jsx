import CountryInfo from "./CountryInfo"
import CountryName from "./CountryName"

const SearchResult = ({shownCountries, weather, showCountry}) => {
  if (shownCountries.length > 5) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }

  if (shownCountries.length == 1) {
    return (
      <CountryInfo country={shownCountries[0]} weather={weather} />
    )
  }
  
  return (
    <div>
      {shownCountries.map((country) => <CountryName name={country.name.common} showCountry={showCountry} key={country.name.common}/>)}
    </div>
  )
}

export default SearchResult