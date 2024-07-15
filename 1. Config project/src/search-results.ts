import { renderBlock } from './lib.js'
import { Place } from './places.js'
import { addToFavorite, getFavoritesList } from './user.js'

export function renderSearchStubBlock() {
    renderBlock(
        'search-results-block',
        `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
    )
}

export function renderEmptyOrErrorSearchBlock(reasonMessage: string) {
    renderBlock(
        'search-results-block',
        `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
    )
}

export function renderSearchResultsBlock(places: Place[]) {

    window['addToFavorite'] = addToFavorite;
    const favoriteUserList = getFavoritesList();

    let placesRender = '';
    places.forEach(place => {
        placesRender += `<ul class="results-list">
        <li class="result">
          <div class="result-container">
            <div class="result-img-container">
              <div class="favorites ${favoriteUserList.has(place.id) ? ' active' : ''}" onclick='addToFavorite(event.target, ${JSON.stringify(place)})'></div>
              <img class="result-img" src="${place.image}" alt="">
            </div>
            <div class="result-info">
              <div class="result-info--header">
                <p>${place.name}</p>
                <p class="price">${place.price}&#8381;</p>
              </div>
              <div class="result-info--map"><i class="map-icon"></i> ${place.remoteness}км от вас</div>
              <div class="result-info--descr">${place.description}</div>
              <div class="result-info--footer">
                <div>
                  <button>Забронировать</button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      `;
    });


    renderBlock(
        'search-results-block',
        `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select>
                <option selected="">Сначала дешёвые</option>
                <option selected="">Сначала дорогие</option>
                <option>Сначала ближе</option>
            </select>
        </div>
    </div>
    ${placesRender}
    `
    );

}
