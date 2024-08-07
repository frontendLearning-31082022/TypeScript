export interface Place {
    id: number | string;
    image: string;
    name: string;
    description: string;
    remoteness: number;
    bookedDates: number[];
    price: number;
}
