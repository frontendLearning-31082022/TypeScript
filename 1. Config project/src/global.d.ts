declare const API_BOOKING: string

declare type LocalStorage_user = { username: string, avatarUrl: string | undefined };
declare type LocalStorage_favoritesAmount = { count: number };
declare type LocalStorage_liked_booking = Pick<Place, 'id' | 'name' | 'image'>;
