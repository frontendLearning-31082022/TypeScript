import { renderBlock } from './lib.js'

// import env from './env.js'
import { Place } from './places.js'
import { renderSearchResultsBlock } from './search-results.js'
import { dateToUnixStamp } from './dates-methods.js'
import { SearchBook_formIds } from './enums.js'

export function renderSearchFormBlock() {
    const minDate: Date = new Date();
    const minDate_out: Date = new Date(new Date(minDate.getTime()).setDate(new Date(minDate.getTime()).getDate() + 2));

    let maxDate: Date = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    maxDate = new Date(new Date(maxDate.getTime()).getFullYear(), new Date(maxDate.getTime()).getMonth() + 1, 0);

    const tomorrow: Date = new Date(new Date().setDate(new Date().getDate() + 1));
    const tomorrow_plus2: Date = new Date(new Date().setDate(new Date().getDate() + 3));

    function dateToStr(date: Date) {
        return date.toLocaleDateString('fr-CA');
    }

    window['searchForm_search'] = handleSearchForm;

    const reCalc_out = document.createElement('script');
    // const API_BOOKING='${env.API_BOOKING}';
    reCalc_out.innerHTML = `

            function reCalc_out(e){
                choosedDate=new Date( Date.parse(e.value));
                const minIncrement = new Date(choosedDate.setDate(choosedDate.getDate() + 2));
                document.getElementById('${SearchBook_formIds.date_checkin}').min=minIncrement.toLocaleDateString("fr-CA")
                document.getElementById('${SearchBook_formIds.date_checkout}').value=minIncrement.toLocaleDateString("fr-CA")
            }
       `;
    document.body.appendChild(reCalc_out);

    renderBlock(
        'search-form-block',
        `
    <form onsubmit="searchForm_search(this); return false;">
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="${SearchBook_formIds.date_checkin}">Дата заезда</label>
            <input id="${SearchBook_formIds.date_checkin}" type="date" onchange="reCalc_out(this)" value="${dateToStr(tomorrow)}" min="${dateToStr(minDate)}" max="${dateToStr(maxDate)}" name="checkin" />
          </div>
          <div>
            <label for="${SearchBook_formIds.date_checkout}">Дата выезда</label>
            <input id="${SearchBook_formIds.date_checkout}" type="date" value="${dateToStr(tomorrow_plus2)}" min="${dateToStr(minDate_out)}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="number" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
    )
}

function handleSearchForm(form: HTMLFormElement): void {
    type formFields = { 'Город': string, 'Дата заезда': string, 'Дата выезда': string, 'Макс. цена суток': number };
    type P = keyof formFields;

    const inputs = ([...form] as HTMLInputElement[]).filter(x => x.tagName == 'INPUT' && x.type != 'hidden');
    const formData: formFields = {} as formFields;
    inputs.filter(x => x.tagName == 'INPUT').forEach(x => {
        const field: P = (x.labels![0].textContent! as P);
        // @ts-expect-error "wtf"
        formData[field] = x.value;
    });

    const params: SearchFormData = {
        city: formData.Город, date_checkin: new Date(formData['Дата заезда']),
        date_checkout: new Date(formData['Дата выезда']), max_price_per_day: +formData['Макс. цена суток']
    };

    const handleSearchResult = (res: Error | Place[]) => {
        if (res instanceof Error) {
            console.log(res);
        } else {
            renderSearchResultsBlock(res as Place[]);
        }
    }
    search(params, handleSearchResult);
}

const providerSearchingConfs = (params: SearchFormData): ProviderConf[] => {
    const api1: ProviderConf = {
        name: 'api1',
        url: 'http://127.0.0.1:3030/places?' +
            `checkInDate=${dateToUnixStamp(params.date_checkin)}&` +
            `checkOutDate=${dateToUnixStamp(params.date_checkout)}&` +
            'coordinates=59.9386,30.3141'
            + (params.max_price_per_day != 0 ? `&maxPrice=${params.max_price_per_day}` : ''),
        converter: null
    };


    const url = `${API_BOOKING}/places?` +
        `checkInDate=${dateToUnixStamp(params.date_checkin)}&` +
        `checkOutDate=${dateToUnixStamp(params.date_checkout)}&` +
        'coordinates=59.9386,30.3141'
        + (params.max_price_per_day != 0 ? `&maxPrice=${params.max_price_per_day}` : '');
    // <reference path="api.d.ts" />
    const api2: ProviderConf = {
        name: 'api2',
        url: 'http://127.0.0.1:3040/places?' +
            `checkInDate=${dateToUnixStamp(params.date_checkin)}&` +
            `checkOutDate=${dateToUnixStamp(params.date_checkout)}&` +
            'coordinates=59.9386,30.3141'
            + (params.max_price_per_day != 0 ? `&maxPrice=${params.max_price_per_day}` : ''),
        converter: (place: Api2.Place[]): Place[] => {
            return place.map(x => {
                const b: Place & { coordinates: number[] } = {} as Place & { coordinates: number[] };
                b.bookedDates = x.bookedDates.map(date => date.getTime());
                b.description = x.details;
                b.id = x.id;
                b.image = x.photos.length > 0 ? x.photos[0] : '';
                b.name = x.title;
                b.price = x.totalPrice;
                b.remoteness = x.remoteness;
                b.coordinates = x.coordinates;
                return b;
            });
        }
    };

    const apis=[api1, api2]
    if(params.filter_by_provider!=null)return apis.filter(x=>x.name===params.filter_by_provider);
    return apis;
}



    fetch(url).then(async x => {
        if (!x.ok) {
            const reason = await x.text();
            throw new Error('Ошибка получения search data ' + reason);
        }

        return x.json();
    }).then((x: Place[] | Error) => {
        handleSearchResult(x);
    }).catch(x => {
        handleSearchResult(x);
    })
}


interface SearchFormData {
    city: string,
    date_checkin: Date,
    date_checkout: Date,
    max_price_per_day: number
    max_price_per_day: number,
    filter_by_provider: null | string
}
