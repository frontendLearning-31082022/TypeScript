import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';

async function runApp() {
    const appPort = 3040;
    const app = express(feathers());
    // app.use(function (req, res, next) {
    //     res.header('Access-Control-Allow-Origin', '*');
    //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //     res.header('Access-Control-Allow-Methods', '*');
    //     next();
    // });
    // app.use(express.json());
    // app.use(express.urlencoded({ extended: true }));
    // app.use(express.static('public'));
    // app.configure(express.rest());
    // app.use(express.errorHandler());

    // app.listen(appPort).on('listening', () => {
    //     console.log(`Server started ${appPort}`);
    // });
    // app.on('error', () => {
    //     console.log('Failed to start server.')
    // })
}
runApp();
