import express, { json } from 'express';

import path from 'path';
import httpProxy from 'http-proxy';
import { createConnection, getConnectionOptions } from 'typeorm';
import { isDevelopment } from './utils/isDevelopment';
import { handleError } from './middleware/error/handleError';
import { router as apiRouter } from './routes';
import { initialize } from './data/fake/initialize';
import { QueryLogger } from './loggers/QueryLogger';
import { isProdLike } from './utils/isProdLike';
import { requestLogger } from './loggers/RequestLogger';
import { dateReviver } from '../client/src/shared/dateReviver';

getConnectionOptions().then((connectionOptions) => {
  createConnection(
    Object.assign(connectionOptions, {
      logger: new QueryLogger(connectionOptions.logging),
    })
  )
    .then(async () => {
      console.log('Successfully established TypeORM DB connection');

      if (!isProdLike()) {
        console.log('Seeding application data...');
        await initialize();
      }

      // Instantiate the application server
      const app = express();

      app.use(requestLogger);
      // Register pre-processing middlewares
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
});
