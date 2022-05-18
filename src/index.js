//import section
import './css/styles.css';
import countryCardTpl from './templates/countryCard.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { fetchCountries } from './js/fetchCountries';
import refs from './js/refs';

var debounce = require('lodash.debounce');

//variables section
const DEBOUNCE_DELAY = 300;

//functions
function clearHtml() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
function onError(err) {
  Notify.failure('Oops, there is no country with that name');
}
function renderCountryList(arr) {
  arr
    .map(
      item =>
        `<li class='list-item'><img class='countri__flag' src='${item.flag}' alt='flag of ${item.name}'></img><p class='list-text'>${item.name}</p></li>`,
    )
    .map(item => refs.countryList.insertAdjacentHTML('beforeend', item));
}
function renderCountryInfo(country) {
  //создаем основную разметку из шаблона
  const markup = countryCardTpl(country);
  refs.countryInfo.innerHTML = markup;
}
function onSearch(e) {
  //очищаем экран
  clearHtml();
  //убираем лишние пробелы, если они есть
  const searchSub = e.target.value.trim();
  if (searchSub.length < 1) {
    return;
  }
  const countrySet = fetchCountries(searchSub);
  countrySet
    .then(arr => {
      //если слишком много результатов
      if (arr.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      //если от 1 до 10
      if (arr.length > 1 && arr.length < 11) {
        renderCountryList(arr);
        return;
      }
      //если 1 результат
      renderCountryInfo(arr[0]);
    })
    //если ошибка
    .catch(onError);
}
//main
refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
