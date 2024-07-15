import { Place } from './places'

export type localStorage_user = { username: string, avatarUrl: string | undefined };
export type localStorage_favoritesAmount = { count: number };
export type localStorage_liked_booking = Pick<Place, 'id' | 'name' | 'image'>;

export const searchBook_formIds = { date_checkin: 'check-in-date', date_checkout: 'check-out-date' } as const;
