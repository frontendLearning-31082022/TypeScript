import { renderBlock, renderToast } from './lib.js'
import { Place } from './places.js'
import { addToFavorite, getFavoritesList } from './user.js'
import { dateToUnixStamp } from './dates-methods.js'
import { SearchBook_formIds } from './enums.js'

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
    window['handleBook'] = handleBook;
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
               ${place.remoteness != undefined ?
                '<div class="result-info--map">' + '<i class="map-icon"></i>' + place.remoteness + ' км от вас' + '</div>' : ''}
              <div class="result-info--descr">${place.description}</div>
              <div class="result-info--footer">
                <div>
                  <button onclick="handleBook('${place.id}','${place.provider}')" class="reserve_btn">Забронировать</button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      `;
    });


    window['handleSortPlaces'] = handleSortPlaces;
    renderBlock(
        'search-results-block',
        `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select onchange="handleSortPlaces(event.target)">
                <option selected="">нет</option>
                <option >${SortPlacesTypes['Сначала дешёвые']}</option>
                <option >${SortPlacesTypes['Сначала дорогие']}</option>
                <option>${SortPlacesTypes['Сначала ближе']}</option>
            </select>
        </div>
    </div>
    ${placesRender}
    `
    );

    invalidDataTimer();
}

function handleSortPlaces(domElem: HTMLSelectElement) {

    const choosed = domElem.getElementsByTagName('option')[domElem.selectedIndex].textContent;
    type elemsType = { el: HTMLElement, val: string | null }

    const placesClassElement = 'results-list';
    const placesDomParentID = 'search-results-block';
    const getElems = (className: string): elemsType[] => {
        return [...document.getElementsByClassName(placesClassElement)]
            .map(x => {
                const nodeVal: HTMLCollectionOf<Element> | null = x.getElementsByClassName(className);
                const valElem = nodeVal.length == 0 ? null : nodeVal[0].textContent;
                return { el: x, val: valElem }
            })
    };

    const comparator = (a: elemsType, b: elemsType) => {
        let one = Infinity;
        let two = Infinity;
        if (a.val != null) {
            one = a.val.replaceAll(new RegExp('\\D', 'g'), '');
        }
        if (b.val != null) {
            two = b.val.replaceAll(new RegExp('\\D', 'g'), '');
        }
        return one - two;
    };

    const comparators: SortPlacesTypes = {} as { typePlace: (type: SortPlacesTypes) => elemsType[] };
    comparators[SortPlacesTypes['Сначала ближе']] = () => {
        return getElems('result-info--map').sort(comparator);
    }
    comparators[SortPlacesTypes['Сначала дешёвые']] = () => {
        return getElems('price').sort(comparator);
    }
    comparators[SortPlacesTypes['Сначала дорогие']] = () => {
        return getElems('price').sort(comparator).reverse();
    }

    comparators[choosed]().forEach(x => {
        document.getElementById(placesDomParentID).appendChild(x.el);
    })

}
enum SortPlacesTypes {
    'Сначала дешёвые' = 'Сначала дешёвые',
    'Сначала дорогие' = 'Сначала дорогие',
    'Сначала ближе' = 'Сначала ближе'
}

function invalidDataTimer() {
    const time = 5 * 60000;
    setTimeout(() => {
        [...document.getElementsByClassName('reserve_btn')].forEach(x => {
            (x as HTMLButtonElement).disabled = true;
            x.setAttribute('onclick', ''); x.textContent = 'Недоступно';
        });
        renderToast({ text: 'Данные неактуальны, обновите страницу.', type: 'error' });
    }, time);
}

function handleBook(placeId: number | string, provider: string) {
    const date_checkin = new Date((document.getElementById(SearchBook_formIds.date_checkin) as HTMLInputElement).value);
    const date_checkout = new Date((document.getElementById(SearchBook_formIds.date_checkout) as HTMLInputElement).value);

    book({ date_checkin: date_checkin, date_checkout: date_checkout, id: placeId, provider: provider });
}

function book(params: BookingParams) {
    const url = providerBookingConfs().filter(x => x.name == params.provider)[0].bookingUrl(params);

    fetch(url, {
        method: 'PATCH',
    }).then(x => {
        if (!x.ok) throw new Error(x.statusText);
        renderToast({ text: 'Место успешно забронировано', type: 'success' });
    }).catch(x => {
        console.log(x);
        renderToast({ text: 'Невозможно забронировать место', type: 'error' });
    });

}

const providerBookingConfs = (): ProviderConf[] => {
    const api1: ProviderConf = {
        name: 'api1',
        url: '',
        converter: null,
        bookingUrl: (params: BookingParams) => {
            return `http://localhost:3030/places/${params.id}?` +
                `checkInDate=${dateToUnixStamp(params.date_checkin)}&` +
                `checkOutDate=${dateToUnixStamp(params.date_checkout)}`;
        }
    };

    const api2: ProviderConf = {
        name: 'api2',
        url: '',
        converter: null,
        bookingUrl: (params: BookingParams) => {
            return `${'http://localhost:3040'}/places/${params.id}?` +
                `checkInDate=${dateToUnixStamp(params.date_checkin)}&` +
                `checkOutDate=${dateToUnixStamp(params.date_checkout)}&`;
        }
    };

    const apis = [api1, api2]
    return apis;
}

type BookingParams = {
    date_checkin: Date,
    date_checkout: Date,
    id: string | number,
    provider: null | string
}
