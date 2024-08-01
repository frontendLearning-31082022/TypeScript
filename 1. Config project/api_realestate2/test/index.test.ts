import { not } from "joi";

function dateToUnixStamp(date: Date) {
    return date.getTime() / 1000
}

function responseToJson(requestPromise: Promise<Response>) {
    return requestPromise
        .then((response) => {
            return response.text()
        })
        .then((response) => {
            return JSON.parse(response)
        })
}

const IP = 'http://localhost:3040';

function search(checkInDate: Date, checkOutDate: Date, maxPrice: number | null) {
    let url = IP + '/places?' +
        `checkInDate=${dateToUnixStamp(checkInDate)}&` +
        `checkOutDate=${dateToUnixStamp(checkOutDate)}&` +
        'coordinates=59.9386,30.3141';

    if (maxPrice != null) {
        url += `&maxPrice=${maxPrice}`
    }

    return responseToJson(fetch(url))
}

function book(placeId: string, checkInDate: Date, checkOutDate: Date) {
    return responseToJson(fetch(
        `${IP}/places/${placeId}?` +
        `checkInDate=${dateToUnixStamp(checkInDate)}&` +
        `checkOutDate=${dateToUnixStamp(checkOutDate)}&`,
        { method: 'PATCH' }
    ));
}

describe('search booking offers', () => {
    it('should return offers', async () => {
        const from = new Date(2024, 7, 29);
        const to = new Date(2024, 8, 2);
        const res = await search(from, to, null);
        expect(res.length).toBeGreaterThan(0);
    });
});

describe('book offer', () => {
    it('should return new id once', async () => {
        const from = new Date(2024, 7, 29);
        const to = new Date(2024, 8, 2);
        const res = await book('ab2e2', from, to);
        expect(res).not.toBeNull();
        expect(res).not.toBeUndefined();
    });
});
