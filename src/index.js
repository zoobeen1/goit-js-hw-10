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
  clearHtml();
  Notify.failure('Oops, there is no country with that name');
}
function renderCountryList(arr) {
  clearHtml();
  const list = arr.map(item => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-item');
    const text = document.createElement('p');
    text.classList.add('list-text');
    text.textContent = item.name;
    const image = document.createElement('img');
    image.classList.add('countri__flag');
    image.src = item.flag;
    image.alt = `flag of ${item.name}`;
    listItem.append(image);
    listItem.append(text);
    return listItem;
  });
  refs.countryList.append(...list);
}
function renderCountryInfo(country) {
  clearHtml();
  //создаем основную разметку из шаблона
  const markup = countryCardTpl(country);
  refs.countryInfo.innerHTML = markup;
  //создаем строку с языками
  let languagesList = '';
  country.languages.map(item => {
    if (languagesList.length > 0) {
      languagesList = languagesList + ', ';
    }
    languagesList = languagesList + item.name;
  });
  const langLine = `<b>Languages:</b> ${languagesList}`;
  //вставляем строку с языками
  const languageLine = document.querySelector('.card-text-line');
  languageLine.innerHTML = langLine;
}
function onSearch(e) {
  //убираем лишние пробелы, если они есть
  const searchSub = e.target.value.trim();
  if (searchSub.length < 1) {
    clearHtml();
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
