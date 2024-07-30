/// <reference types="./types/api_realestate2.d.ts" />

import { NullableId, Params } from '@feathersjs/feathers';
import { BadRequest, NotFound } from '@feathersjs/errors';
import { DateHelper } from './helpers/DateHelper';
import { Booking } from './repositories/Booking';
import Joi = require('joi');

export class PlaceRestController {
    constructor(private placeRepository: FlatRentSdk) { }

    public async get(id: NullableId, params?: Params): Promise<Flat | null> {
        const numericId = Number(id);
        if (!isFinite(numericId) || numericId <= 0) {
            throw new BadRequest();
        }

        const coordinates: string = params?.query?.coordinates || '';
        const place = await this.placeRepository.get(numericId.toString());

        if (place != null && coordinates === '') {
            place.remoteness = 0;
        }

        return place;
    }

    public async find(params?: Params): Promise<Flat[]> {
        const query: Partial<FilterPayload> = params?.query || {};
        const minDate = DateHelper.resetTimeInDate(new Date());
        const filterSchema = Joi.object<FilterPayload>({
            coordinates: Joi.string()
                .pattern(new RegExp('^[0-9]{1,3}.[0-9]{1,15},[0-9]{1,3}.[0-9]{1,15}$'))
                .required(),
            checkInDate: Joi.date().timestamp('unix').min(minDate).required(),
            checkOutDate: Joi.date().timestamp('unix').greater(Joi.ref('checkInDate')).required(),
            maxPrice: Joi.number().min(1).default(0)
        });
        const validationResult = filterSchema.validate(query);

        if (validationResult.error != null) {
            throw new BadRequest(validationResult.error.message, validationResult.error.details);
        }

        const validatedParams: FilterPayload = validationResult.value;
        // const coordinatesArray = validatedParams.coordinates.split(',');

        //TODO stub city
        const parameters = { city: 'Санкт-Петербург', checkInDate: validatedParams.checkInDate, checkOutDate: validatedParams.checkOutDate, priceLimit: validatedParams.maxPrice };

        return await this.placeRepository.search(parameters);
    }

    public async patch(id: NullableId, data: Partial<Place>, params?: Params): Promise<Number> {
        const numericId = Number(id);
        if (!isFinite(numericId) || numericId <= 0) {
            throw new BadRequest('Place ID is not correct.');
        }

        const placeToBook = await this.get(id);
        if (placeToBook == null) {
            throw new NotFound('Place not found.');
        }

        const minDate = DateHelper.resetTimeInDate(new Date());
        const query: Partial<BookingPayload> = params?.query || {};
        const bookingSchema = Joi.object<BookingPayload>({
            checkInDate: Joi.date().timestamp('unix').min(minDate).required(),
            checkOutDate: Joi.date().timestamp('unix').greater(Joi.ref('checkInDate')).required(),
        });
        const validationResult = bookingSchema.validate(query);

        if (validationResult.error != null) {
            throw new BadRequest(validationResult.error.message, validationResult.error.details);
        }

        const validatedParams: BookingPayload = validationResult.value;
        const booking: Booking = validatedParams;
        const dateToBook = DateHelper.generateDateRange(booking.checkInDate, booking.checkOutDate);

        return await this.placeRepository.book(
            { flatId: numericId, checkInDate: dateToBook[0], checkOutDate: dateToBook[1] }
        );
    }
}
