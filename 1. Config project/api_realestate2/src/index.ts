import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import { PlaceRestController } from './PlaceRestController';

/// <reference types="./types/api_realestate2.d.ts" />

async function runApp() {
    const appPort = 3040;
    const app = express(feathers());
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', '*');
        next();
    });
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.configure(express.rest());
    app.use(express.errorHandler());

    app.use('/places', new PlaceRestController(new FlatRentSdk()));


    app.listen(appPort).on('listening', () => {
        console.log(`Server started ${appPort}`);
    });
    app.on('error', () => {
        console.log('Failed to start server.')
    })
}
runApp();
