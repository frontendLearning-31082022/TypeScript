export interface Place {
    id: number | string;
    image: string | undefined;
    name: string;
    description: string;
    remoteness: number;
    bookedDates: number[];
    price: number;
    provider:string;
}
