import WeatherInfo from "./WeatherInfo"

const CountryInfo = ({country, weather}) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      capital {country.capital[0]} <br />
      area {country.area}
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => <li key={language}>{language}</li>)}
      </ul>
      <div className='flag'>{country.flag}</div>
      <WeatherInfo capital={country.capital} weather={weather}/>
    </div>
  )
}

export default CountryInfo