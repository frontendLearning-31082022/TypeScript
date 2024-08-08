declare class FlatRentSdk {
    get(id: string): Promise<Flat | null>;
    search(parameters: { city: string, checkInDate: Date, checkOutDate: Date, priceLimit: number | null }): Flat[];
    book(flatId: string, checkInDate: Date, checkOutDate: Date): number;
}
 type Flat = {
    id: string,
    title: string,
    details: string,
    photos: string[],
    coordinates: number[],
    bookedDates: Date[],
    price: number,
    remoteness: number
}
