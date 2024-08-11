declare const API_BOOKING: string

declare type LocalStorage_user = { username: string, avatarUrl: string | undefined };
declare type LocalStorage_favoritesAmount = { count: number };
declare type LocalStorage_liked_booking = Pick<Place, 'id' | 'name' | 'image'>;

interface Window {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    [key: string]: any;
}

type ProviderConf = { name: string, url: string, converter: ((unknown) => Place[]) | null ,bookingUrl:((params: BookingParams)=> string) | null};
type PlacesResults = Map<ProviderConf, Place[]>;
