const CountryName = ({name, showCountry}) => (
  <div>
    {name}
    <button onClick={() => showCountry(name)}>show</button>
  </div>
)

export default CountryName