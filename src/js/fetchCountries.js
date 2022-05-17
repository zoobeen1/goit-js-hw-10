const BASE_URL = 'https://restcountries.com/v2/name';
const FILTER = '?fields=name,capital,population,flag,languages';
async function fetchCountries(country) {
  const responce = await fetch(`${BASE_URL}/${country}${FILTER}`);
  return await responce.json();
}
export { fetchCountries };
