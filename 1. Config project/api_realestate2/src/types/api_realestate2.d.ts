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



// type Id = number | string;
// type NullableId = Id | null;



// interface FeathersErrorJSON {
//     readonly name: string;
//     readonly message: string;
//     readonly code: number;
//     readonly className: string;
//     readonly data?: any;
//     readonly errors: any;
// }

// interface Errors {
//     FeathersError: FeathersError;
//     BadRequest: BadRequest;
//     NotAuthenticated: NotAuthenticated;
//     PaymentError: PaymentError;
//     Forbidden: Forbidden;
//     NotFound: NotFound;
//     MethodNotAllowed: MethodNotAllowed;
//     NotAcceptable: NotAcceptable;
//     Timeout: Timeout;
//     Conflict: Conflict;
//     LengthRequired: LengthRequired;
//     Unprocessable: Unprocessable;
//     TooManyRequests: TooManyRequests;
//     GeneralError: GeneralError;
//     NotImplemented: NotImplemented;
//     BadGateway: BadGateway;
//     Unavailable: Unavailable;
//     400: BadRequest;
//     401: NotAuthenticated;
//     402: PaymentError;
//     403: Forbidden;
//     404: NotFound;
//     405: MethodNotAllowed;
//     406: NotAcceptable;
//     408: Timeout;
//     409: Conflict;
//     411: LengthRequired;
//     422: Unprocessable;
//     429: TooManyRequests;
//     500: GeneralError;
//     501: NotImplemented;
//     502: BadGateway;
//     503: Unavailable;
// }

// // export class FeathersError extends Error {
// //     readonly code: number;
// //     readonly className: string;
// //     readonly data?: unknown;
// //     readonly errors: any;
// //     constructor(msg: string | Error, name: string, code: number, className: string, data: any);
// //     toJSON(): FeathersErrorJSON;
// // }

// // export class BadRequest extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class NotAuthenticated extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class PaymentError extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class Forbidden extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class NotFound extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class MethodNotAllowed extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class NotAcceptable extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class Timeout extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class Conflict extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class LengthRequired extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class Unprocessable extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class TooManyRequests extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class GeneralError extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class NotImplemented extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class BadGateway extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }

// // export class Unavailable extends FeathersError {
// //     constructor(msg?: string | Error, data?: any);
// // }



// // export function convert(error: any): FeathersError;

// // export const types: Errors;
// // export const errors: Errors;