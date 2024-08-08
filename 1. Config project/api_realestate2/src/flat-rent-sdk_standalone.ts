
import { FlatRentSdk } from './flat-rent-sdk'

const databaseStub = [
    {
        id: 'vnd331',
        title: 'Radisson Royal Hotel',
        details: 'Отель расположен в 4 минутах ходьбы от станции метро «Маяковская». К услугам гостей фитнес-центр и спа-центр с сауной и гидромассажной ванной.',
        photos: ['vnd331.png', 'vnd331.png'],
        coordinates: [59.9322936, 30.3460129],
        bookedDates: [],
        price: 12000
    },
    {
        id: 'ab2e2',
        title: 'Номера на Садовой',
        details: 'Расположен в 7 минутах ходьбы от Невского проспекта. К услугам гостей круглосуточная стойка регистрации и бесплатный Wi-Fi.',
        photos: ['ab2e2.png', 'ab2e2.png'],
        coordinates: [59.930325, 30.3291592],
        bookedDates: [],
        price: 4500
    },
    {
        id: 'mvm32l',
        title: 'Мини Отель на Невском 136',
        details: 'Мини-отель расположен в Санкт-Петербурге, в 5 минутах ходьбы от станции метро «Площадь Восстания» и Московского железнодорожного вокзала.',
        photos: ['mvm32l.png', 'mvm32l.png'],
        coordinates: [59.9299603, 30.3658932],
        bookedDates: [],
        price: 3800
    },
    {
        id: 'bvep12',
        title: 'Отель Усадьба Державина',
        details: 'Прекрасный отель недалеко от Исаакиевского собора с бесплатным Wi-Fi на всей территории.',
        photos: ['bvep12.png', 'bvep12.png'],
        coordinates: [59.9194966, 30.309389],
        bookedDates: [],
        price: 8700
    }
]

type DatabaseStubEntry = { id: string, title: string, details: string, photos: string[], coordinates: number[], bookedDates: Date[], price: number }

export class FlatRentSdkStandalone extends FlatRentSdk {
    database: DatabaseStubEntry[]

    constructor() {
        super()
        this.database = this._readDatabase();
    }

    _readDatabase() {
        return databaseStub;
    }

    _writeDatabase(database: DatabaseStubEntry[]) {
        this.database = database;
    }

}
