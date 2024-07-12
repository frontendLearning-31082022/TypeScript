import { renderBlock } from './lib.js'

import env from './env.js'
import { Place } from './places.js'
import { renderSearchResultsBlock } from './search-results.js'

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

    // @ts-expect-error "global window. set var"
    window['searchForm_search'] = handleSearchForm;

    const reCalc_out = document.createElement('script');
    reCalc_out.innerHTML = `
            const API_BOOKING='${env.API_BOOKING}';
            function reCalc_out(e){
                choosedDate=new Date( Date.parse(e.value));
                const minIncrement = new Date(choosedDate.setDate(choosedDate.getDate() + 2));
                document.getElementById('check-out-date').min=minIncrement.toLocaleDateString("fr-CA")
                document.getElementById('check-out-date').value=minIncrement.toLocaleDateString("fr-CA")
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
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" onchange="reCalc_out(this)" value="${dateToStr(tomorrow)}" min="${dateToStr(minDate)}" max="${dateToStr(maxDate)}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${dateToStr(tomorrow_plus2)}" min="${dateToStr(minDate_out)}" name="checkout" />
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

function search(params: SearchFormData, handleSearchResult: (error: (Error | Place[])) =>
    void): void {

    const dateToUnixStamp = (date: Date) => { return date.getTime() / 1000 }

    const url = `${API_BOOKING}/places?` +
        `checkInDate=${dateToUnixStamp(params.date_checkin)}&` +
        `checkOutDate=${dateToUnixStamp(params.date_checkout)}&` +
        'coordinates=59.9386,30.3141'
        + (params.max_price_per_day != 0 ? `&maxPrice=${params.max_price_per_day}` : '');


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
}
