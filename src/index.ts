import express, { json } from 'express';

import path from 'path';
import httpProxy from 'http-proxy';
import { isDevelopment } from './utils/isDevelopment';
import { handleError } from './middleware/error/handleError';
import { createConnection } from 'typeorm';
import { router as apiRouter } from './routes';
import { initialize } from './data/initialize';
import moment from 'moment';

createConnection()
  .then(async () => {
    console.log('Successfully established TypeORM DB connection');

    // Staging != 'development', and we don't currently have a way of distinguishing
    // env in deployed app BUT we don't have prod env so just always init seed data!
    // if (isDevelopment()) {
    await initialize();
    // }

    // Instantiate the application server
    const app = express();

    // Register pre-processing middlewares
    const dateReviver = (_: any, value: string) => {
      if (typeof value === 'string') {
        const parsedDate = moment.utc(value, undefined, true);
        if (parsedDate.isValid()) return parsedDate;
      }
      return value;
    };
    app.use(json({ reviver: dateReviver }));

    // Register business logic routes
    app.use('/api', apiRouter);

    // Handle errors
    app.use('/api', handleError);

    // Handle non-existant API routes
    app.use('/api', (_, res) => res.sendStatus(400));

    const pathToReactApp = isDevelopment()
      ? path.join(__dirname, '../client/build')
      : path.join(__dirname, '../../client/build');

    /* Register SPA-serving middlewares */
    // Serve the static files from the React app
    app.use(express.static(pathToReactApp));

    // Handles any requests that don't match the ones above
    if (!isDevelopment()) {
      // Register the fallback route to index.html
      app.get('*', (_, res) =>
        res.sendFile(path.join(pathToReactApp, '/index.html'))
      );
    } else {
      // When in development, proxy requests to the docker container for the client
      const proxy = httpProxy.createProxy({
        target: process.env.CLIENT_URL || 'http://client:3000',
      });
      app.get('*', (req, res) => proxy.web(req, res));
    }

    const port = process.env.PORT || 3000;
    app.listen(port);

    console.log('App is listening on port ' + port);
  })
  .catch((err) => console.error('error connecting to DB with typeorm', err));
