interface Place {
    id: number;
    image: string;
    name: string;
    description: string;
    remoteness: number;
    bookedDates: number[];
    price: number;
}

interface FilterPayload {
    coordinates: string;
    checkInDate: Date;
    checkOutDate: Date;
    maxPrice: number | null;
}

interface Filter {
    coordinates: [number, number];
    startDate: Date;
    endDate: Date;
    maxPrice: number;
}

interface BookingPayload {
    checkInDate: Date;
    checkOutDate: Date;
}

interface PlaceRepository {
    get(id: number): Promise<Place>;
    find(filter: Filter): Promise<Place[]>;
    book(place: Place, dateRange: Date[]): Promise<Place>;
    checkIfPlaceAreAvailableForDates(place: Place, dateRange: Date[]): boolean
}
