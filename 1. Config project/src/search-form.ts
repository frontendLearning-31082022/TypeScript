import { renderBlock } from './lib.js'

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

    const reCalc_out = document.createElement('script');
    reCalc_out.innerHTML = `
            function reCalc_out(e){
                choosedDate=new Date( Date.parse(e.value));
                const minIncrement = new Date(choosedDate.setDate(choosedDate.getDate() + 2));
                document.getElementById('check-out-date').min=minIncrement.toLocaleDateString("fr-CA")
                document.getElementById('check-out-date').value=minIncrement.toLocaleDateString("fr-CA")
                debugger;
            }
       `;
    document.body.appendChild(reCalc_out);

    renderBlock(
        'search-form-block',
        `
    <form>
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
            <input id="max-price" type="text" value="" name="price" class="max-price" />
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
