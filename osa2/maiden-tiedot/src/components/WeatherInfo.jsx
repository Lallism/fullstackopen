const WeatherInfo = ({capital, weather}) => {
  if (weather.current !== undefined) {
    return(
      <>
        <h3>Weather in {capital}</h3>
        temperature {weather.current.temp_c} celsius <br />
        <img src={weather.current.condition.icon} /> <br />
        wind {(weather.current.wind_kph / 3.6).toFixed(1)} m/s
      </>
    )
  }

  return (
    <>
      waiting for weather
    </>
  )
}

export default WeatherInfo